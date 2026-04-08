import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { getAdminToken } from "../../utils/authToken";
import type { ApiResponse, DailyDiscount, DailyDiscountState } from "../../types/dealTypes";

const initialState: DailyDiscountState = {
  discounts: [],
  loading: false,
  error: null,
  discountCreated: false,
  discountUpdated: false,
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAdminToken()}`,
});

export const createDailyDiscount = createAsyncThunk(
  "dailyDiscount/create",
  async (payload: Partial<DailyDiscount>, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/daily-discounts", payload, {
        headers: authHeaders(),
      });
      return response.data as DailyDiscount;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create daily discount");
    }
  },
);

export const getAllDailyDiscounts = createAsyncThunk(
  "dailyDiscount/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/daily-discounts", {
        headers: authHeaders(),
      });
      return response.data as DailyDiscount[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load daily discounts");
    }
  },
);

export const updateDailyDiscount = createAsyncThunk<
  DailyDiscount,
  { id: number; payload: Partial<DailyDiscount> }
>(
  "dailyDiscount/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/daily-discounts/${id}`, payload, {
        headers: authHeaders(),
      });
      return response.data as DailyDiscount;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update daily discount");
    }
  },
);

export const updateDailyDiscountStatus = createAsyncThunk<
  DailyDiscount,
  { id: number; active: boolean }
>(
  "dailyDiscount/updateStatus",
  async ({ id, active }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/daily-discounts/${id}/status`, null, {
        params: { active },
        headers: authHeaders(),
      });
      return response.data as DailyDiscount;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  },
);

export const deleteDailyDiscount = createAsyncThunk<ApiResponse, number>(
  "dailyDiscount/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/daily-discounts/${id}`, {
        headers: authHeaders(),
      });
      return response.data as ApiResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete daily discount");
    }
  },
);

const dailyDiscountSlice = createSlice({
  name: "dailyDiscount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllDailyDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDailyDiscounts.fulfilled, (state, action: PayloadAction<DailyDiscount[]>) => {
        state.loading = false;
        state.discounts = action.payload;
      })
      .addCase(getAllDailyDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createDailyDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.discountCreated = false;
      })
      .addCase(createDailyDiscount.fulfilled, (state, action: PayloadAction<DailyDiscount>) => {
        state.loading = false;
        state.discountCreated = true;
        state.discounts.push(action.payload);
      })
      .addCase(createDailyDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDailyDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.discountUpdated = false;
      })
      .addCase(updateDailyDiscount.fulfilled, (state, action: PayloadAction<DailyDiscount>) => {
        state.loading = false;
        state.discountUpdated = true;
        const index = state.discounts.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.discounts[index] = action.payload;
      })
      .addCase(updateDailyDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDailyDiscountStatus.fulfilled, (state, action: PayloadAction<DailyDiscount>) => {
        const index = state.discounts.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.discounts[index] = action.payload;
      })
      .addCase(deleteDailyDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDailyDiscount.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.discounts = state.discounts.filter((item) => item.id !== action.meta.arg);
        }
      })
      .addCase(deleteDailyDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dailyDiscountSlice.reducer;
