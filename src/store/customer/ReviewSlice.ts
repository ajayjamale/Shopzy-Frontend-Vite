import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import type {
  ApiResponse,
  CreateReviewRequest,
  Review,
  ReviewState,
} from "../../types/reviewTypes";

const parseErrorMessage = (error: any, fallback: string): string => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  if (typeof data?.error === "string" && data.error.trim()) return data.error;
  if (typeof error?.message === "string" && error.message.trim()) return error.message;
  return fallback;
};

const REVIEW_ENDPOINTS = {
  byProduct: (productId: number) => [
    `/products/${productId}/reviews`,
    `/api/products/${productId}/reviews`,
  ],
  byReviewId: (reviewId: number) => [
    `/reviews/${reviewId}`,
    `/api/reviews/${reviewId}`,
  ],
};

const isRetriableEndpointError = (status?: number) =>
  status === 401 || status === 403 || status === 404 || status === 405;

const authHeaders = (jwt: string) => ({
  Authorization: `Bearer ${jwt}`,
});

const normalizeImageList = (item: any): string[] => {
  const sources = [item?.productImages, item?.images, item?.reviewImages, item?.media];
  for (const source of sources) {
    if (Array.isArray(source)) {
      return source.filter((img): img is string => typeof img === "string" && img.trim().length > 0);
    }
    if (typeof source === "string" && source.trim().length > 0) {
      return [source.trim()];
    }
  }
  return [];
};

const normalizeReviewsPayload = (payload: any): Review[] => {
  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.content)
      ? payload.content
      : Array.isArray(payload?.reviews)
        ? payload.reviews
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

  return rawList.map((item: any) => {
    const normalizedRating = Number(item?.rating ?? item?.reviewRating ?? item?.stars ?? 0);
    return {
      ...item,
      rating: Number.isFinite(normalizedRating) ? normalizedRating : 0,
      reviewText: item?.reviewText ?? item?.comment ?? item?.text ?? "",
      productImages: normalizeImageList(item),
      reviewTitle: item?.reviewTitle ?? item?.title ?? undefined,
    } as Review;
  });
};

const buildReviewPayload = (review: CreateReviewRequest) => {
  const productImages = Array.isArray(review?.productImages)
    ? review.productImages.filter((img): img is string => typeof img === "string" && img.trim().length > 0)
    : [];

  return {
    ...review,
    productImages,
    images: productImages,
    rating: review.reviewRating,
  };
};

const fetchReviewsFromAnyEndpoint = async (productId: number, jwt?: string | null) => {
  let lastError: any;
  for (const endpoint of REVIEW_ENDPOINTS.byProduct(productId)) {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (publicError: any) {
      lastError = publicError;
      const publicStatus = publicError?.response?.status as number | undefined;

      if ((publicStatus === 401 || publicStatus === 403) && jwt) {
        try {
          const authedResponse = await api.get(endpoint, { headers: authHeaders(jwt) });
          return authedResponse.data;
        } catch (authedError: any) {
          lastError = authedError;
          const authedStatus = authedError?.response?.status as number | undefined;
          if (isRetriableEndpointError(authedStatus)) continue;
          throw authedError;
        }
      }

      if (isRetriableEndpointError(publicStatus)) continue;
      throw publicError;
    }
  }

  throw lastError ?? new Error("Failed to fetch reviews");
};

const requestAuthEndpointWithFallback = async (
  method: "post" | "patch" | "delete",
  endpoints: string[],
  jwt: string,
  payload?: any
) => {
  let lastError: any;
  for (const endpoint of endpoints) {
    try {
      if (method === "post") {
        return await api.post(endpoint, payload, { headers: authHeaders(jwt) });
      }
      if (method === "patch") {
        return await api.patch(endpoint, payload, { headers: authHeaders(jwt) });
      }
      return await api.delete(endpoint, { headers: authHeaders(jwt) });
    } catch (error: any) {
      lastError = error;
      const status = error?.response?.status as number | undefined;
      if (status === 404 || status === 405) continue;
      throw error;
    }
  }
  throw lastError ?? new Error("Request failed");
};

// Async thunks
export const fetchReviewsByProductId = createAsyncThunk<
  Review[],
  { productId: number },
  { rejectValue: string }
>(
  "review/fetchReviewsByProductId",
  async ({ productId }, { rejectWithValue }) => {
    try {
      if (!Number.isFinite(productId) || productId <= 0) {
        return [];
      }

      const jwt = localStorage.getItem("jwt");
      const responseData = await fetchReviewsFromAnyEndpoint(productId, jwt);
      return normalizeReviewsPayload(responseData);
    } catch (error: any) {
      return rejectWithValue(parseErrorMessage(error, "Failed to fetch reviews"));
    }
  }
);

export const createReview = createAsyncThunk<
  Review,
  { productId: number; review: CreateReviewRequest; jwt: string; navigate?: any },
  { rejectValue: string }
>(
  "review/createReview",
  async ({ productId, review, jwt, navigate }, { rejectWithValue }) => {
    try {
      if (!jwt) {
        return rejectWithValue("Please log in to submit a review.");
      }

      const payload = buildReviewPayload(review);
      const response = await requestAuthEndpointWithFallback(
        "post",
        REVIEW_ENDPOINTS.byProduct(productId),
        jwt,
        payload
      );

      if (navigate) navigate(`/reviews/${productId}`);
      return normalizeReviewsPayload([response.data])[0];
    } catch (error: any) {
      return rejectWithValue(parseErrorMessage(error, "Failed to create review"));
    }
  }
);

export const updateReview = createAsyncThunk<
  Review,
  { reviewId: number; review: CreateReviewRequest; jwt: string },
  { rejectValue: string }
>(
  "review/updateReview",
  async ({ reviewId, review, jwt }, { rejectWithValue }) => {
    try {
      if (!jwt) {
        return rejectWithValue("Please log in to update your review.");
      }

      const payload = buildReviewPayload(review);
      const response = await requestAuthEndpointWithFallback(
        "patch",
        REVIEW_ENDPOINTS.byReviewId(reviewId),
        jwt,
        payload
      );

      return normalizeReviewsPayload([response.data])[0];
    } catch (error: any) {
      return rejectWithValue(parseErrorMessage(error, "Failed to update review"));
    }
  }
);

export const deleteReview = createAsyncThunk<
  ApiResponse,
  { reviewId: number; jwt: string },
  { rejectValue: string }
>("review/deleteReview", async ({ reviewId, jwt }, { rejectWithValue }) => {
  try {
    if (!jwt) {
      return rejectWithValue("Please log in to delete your review.");
    }

    const response = await requestAuthEndpointWithFallback(
      "delete",
      REVIEW_ENDPOINTS.byReviewId(reviewId),
      jwt
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(parseErrorMessage(error, "Failed to delete review"));
  }
});

// Initial state
const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
  reviewCreated: false,
  reviewUpdated: false,
  reviewDeleted: false,
  success: false,
  successMessage: null,
};

// Slice
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.reviews = [];
      state.loading = false;
      state.error = null;
      state.reviewCreated = false;
      state.reviewUpdated = false;
      state.reviewDeleted = false;
      state.success = false;
      state.successMessage = null;
    },
    resetReviewFeedback: (state) => {
      state.error = null;
      state.reviewCreated = false;
      state.reviewUpdated = false;
      state.reviewDeleted = false;
      state.success = false;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReviewsByProductId.fulfilled,
        (state, action: PayloadAction<Review[]>) => {
          state.reviews = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchReviewsByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.reviewCreated = false;
        state.success = false;
        state.successMessage = null;
      })
      .addCase(
        createReview.fulfilled,
        (state, action: PayloadAction<Review>) => {
          const existingIndex = state.reviews.findIndex((r) => r.id === action.payload.id);
          if (existingIndex === -1) {
            state.reviews.push(action.payload);
          } else {
            state.reviews[existingIndex] = action.payload;
          }
          state.loading = false;
          state.reviewCreated = true;
          state.success = true;
          state.successMessage = "Review submitted successfully.";
        }
      )
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.reviewCreated = false;
        state.success = false;
        state.successMessage = null;
      })
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.reviewUpdated = false;
      })
      .addCase(
        updateReview.fulfilled,
        (state, action: PayloadAction<Review>) => {
          const index = state.reviews.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) {
            state.reviews[index] = action.payload;
          }
          state.loading = false;
          state.reviewUpdated = true;
        }
      )
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.reviewUpdated = false;
        state.success = false;
        state.successMessage = null;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.reviewDeleted = false;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (r) => r.id !== action.meta.arg.reviewId
        );
        state.loading = false;
        state.reviewDeleted = true;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.reviewDeleted = false;
        state.success = false;
        state.successMessage = null;
      });
  },
});

export default reviewSlice.reducer;
export const { resetReviewState, resetReviewFeedback } = reviewSlice.actions;

