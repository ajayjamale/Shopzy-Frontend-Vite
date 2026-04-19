import { createSlice, createAsyncThunk } from '../../context/miniToolkit.js'
import { api } from '../../config/Api'
const parseErrorMessage = (error, fallback) => {
  const data = error?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (typeof data?.message === 'string' && data.message.trim()) return data.message
  if (typeof data?.error === 'string' && data.error.trim()) return data.error
  if (typeof error?.message === 'string' && error.message.trim()) return error.message
  return fallback
}
const REVIEW_ENDPOINTS = {
  byProduct: (productId) => [`/api/products/${productId}/reviews`],
  byReviewId: (reviewId) => [`/api/reviews/${reviewId}`],
}
const isRetriableEndpointError = (status) =>
  status === 401 || status === 403 || status === 404 || status === 405
const authHeaders = (jwt) => ({
  Authorization: `Bearer ${jwt}`,
})
const normalizeImageList = (item) => {
  const sources = [item?.productImages, item?.images, item?.reviewImages, item?.media]
  for (const source of sources) {
    if (Array.isArray(source)) {
      return source.filter((img) => typeof img === 'string' && img.trim().length > 0)
    }
    if (typeof source === 'string' && source.trim().length > 0) {
      return [source.trim()]
    }
  }
  return []
}
const normalizeReviewsPayload = (payload) => {
  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.content)
      ? payload.content
      : Array.isArray(payload?.reviews)
        ? payload.reviews
        : Array.isArray(payload?.data)
          ? payload.data
          : []
  return rawList.map((item) => {
    const normalizedRating = Number(item?.rating ?? item?.reviewRating ?? item?.stars ?? 0)
    return {
      ...item,
      rating: Number.isFinite(normalizedRating) ? normalizedRating : 0,
      reviewText: item?.reviewText ?? item?.comment ?? item?.text ?? '',
      productImages: normalizeImageList(item),
      reviewTitle: item?.reviewTitle ?? item?.title ?? undefined,
    }
  })
}
const buildReviewPayload = (review) => {
  const productImages = Array.isArray(review?.productImages)
    ? review.productImages.filter((img) => typeof img === 'string' && img.trim().length > 0)
    : []
  return {
    ...review,
    productImages,
    images: productImages,
    rating: review.reviewRating,
  }
}
const fetchReviewsFromAnyEndpoint = async (productId, jwt) => {
  let lastError
  for (const endpoint of REVIEW_ENDPOINTS.byProduct(productId)) {
    try {
      const response = await api.get(endpoint)
      return response.data
    } catch (publicError) {
      lastError = publicError
      const publicStatus = publicError?.response?.status
      if ((publicStatus === 401 || publicStatus === 403) && jwt) {
        try {
          const authedResponse = await api.get(endpoint, { headers: authHeaders(jwt) })
          return authedResponse.data
        } catch (authedError) {
          lastError = authedError
          const authedStatus = authedError?.response?.status
          if (isRetriableEndpointError(authedStatus)) continue
          throw authedError
        }
      }
      if (isRetriableEndpointError(publicStatus)) continue
      throw publicError
    }
  }
  throw lastError ?? new Error('Failed to fetch reviews')
}
const requestAuthEndpointWithFallback = async (method, endpoints, jwt, payload) => {
  let lastError
  for (const endpoint of endpoints) {
    try {
      if (method === 'post') {
        return await api.post(endpoint, payload, { headers: authHeaders(jwt) })
      }
      if (method === 'patch') {
        return await api.patch(endpoint, payload, { headers: authHeaders(jwt) })
      }
      return await api.delete(endpoint, { headers: authHeaders(jwt) })
    } catch (error) {
      lastError = error
      const status = error?.response?.status
      if (status === 404 || status === 405) continue
      throw error
    }
  }
  throw lastError ?? new Error('Request failed')
}
// Async thunks
export const fetchReviewsByProductId = createAsyncThunk(
  'review/fetchReviewsByProductId',
  async ({ productId }, { rejectWithValue }) => {
    try {
      if (!Number.isFinite(productId) || productId <= 0) {
        return []
      }
      const jwt = localStorage.getItem('jwt')
      const responseData = await fetchReviewsFromAnyEndpoint(productId, jwt)
      return normalizeReviewsPayload(responseData)
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, 'Failed to fetch reviews'))
    }
  },
)
export const createReview = createAsyncThunk(
  'review/createReview',
  async ({ productId, review, jwt, navigate }, { rejectWithValue }) => {
    try {
      if (!jwt) {
        return rejectWithValue('Please log in to submit a review.')
      }
      const payload = buildReviewPayload(review)
      const response = await requestAuthEndpointWithFallback(
        'post',
        REVIEW_ENDPOINTS.byProduct(productId),
        jwt,
        payload,
      )
      if (navigate) navigate(`/reviews/${productId}`)
      return normalizeReviewsPayload([response.data])[0]
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, 'Failed to create review'))
    }
  },
)
export const updateReview = createAsyncThunk(
  'review/updateReview',
  async ({ reviewId, review, jwt }, { rejectWithValue }) => {
    try {
      if (!jwt) {
        return rejectWithValue('Please log in to update your review.')
      }
      const payload = buildReviewPayload(review)
      const response = await requestAuthEndpointWithFallback(
        'patch',
        REVIEW_ENDPOINTS.byReviewId(reviewId),
        jwt,
        payload,
      )
      return normalizeReviewsPayload([response.data])[0]
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, 'Failed to update review'))
    }
  },
)
export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async ({ reviewId, jwt }, { rejectWithValue }) => {
    try {
      if (!jwt) {
        return rejectWithValue('Please log in to delete your review.')
      }
      const response = await requestAuthEndpointWithFallback(
        'delete',
        REVIEW_ENDPOINTS.byReviewId(reviewId),
        jwt,
      )
      return response.data
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, 'Failed to delete review'))
    }
  },
)
// Initial state
const initialState = {
  reviews: [],
  loading: false,
  error: null,
  reviewCreated: false,
  reviewUpdated: false,
  reviewDeleted: false,
  success: false,
  successMessage: null,
}
// Slice
const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.reviews = []
      state.loading = false
      state.error = null
      state.reviewCreated = false
      state.reviewUpdated = false
      state.reviewDeleted = false
      state.success = false
      state.successMessage = null
    },
    resetReviewFeedback: (state) => {
      state.error = null
      state.reviewCreated = false
      state.reviewUpdated = false
      state.reviewDeleted = false
      state.success = false
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByProductId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReviewsByProductId.fulfilled, (state, action) => {
        state.reviews = action.payload
        state.loading = false
      })
      .addCase(fetchReviewsByProductId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true
        state.error = null
        state.reviewCreated = false
        state.success = false
        state.successMessage = null
      })
      .addCase(createReview.fulfilled, (state, action) => {
        const existingIndex = state.reviews.findIndex((r) => r.id === action.payload.id)
        if (existingIndex === -1) {
          state.reviews.push(action.payload)
        } else {
          state.reviews[existingIndex] = action.payload
        }
        state.loading = false
        state.reviewCreated = true
        state.success = true
        state.successMessage = 'Review submitted successfully.'
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.reviewCreated = false
        state.success = false
        state.successMessage = null
      })
      .addCase(updateReview.pending, (state) => {
        state.loading = true
        state.error = null
        state.reviewUpdated = false
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) {
          state.reviews[index] = action.payload
        }
        state.loading = false
        state.reviewUpdated = true
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.reviewUpdated = false
        state.success = false
        state.successMessage = null
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true
        state.error = null
        state.reviewDeleted = false
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r.id !== action.meta.arg.reviewId)
        state.loading = false
        state.reviewDeleted = true
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.reviewDeleted = false
        state.success = false
        state.successMessage = null
      })
  },
})
export default reviewSlice.reducer
export const { resetReviewState, resetReviewFeedback } = reviewSlice.actions
