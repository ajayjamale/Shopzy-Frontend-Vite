import { createAsyncThunk, createSlice } from '../../context/miniToolkit.js'
import { adminApiPath, api } from '../../config/Api'
import { getAdminToken } from '../../utils/authToken'
const initialState = {
  discounts: [],
  loading: false,
  error: null,
  discountCreated: false,
  discountUpdated: false,
}
const API_URL = adminApiPath('/daily-discounts')
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getAdminToken()}`,
})
export const createDailyDiscount = createAsyncThunk(
  'dailyDiscount/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL, payload, {
        headers: authHeaders(),
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create daily discount')
    }
  },
)
export const getAllDailyDiscounts = createAsyncThunk(
  'dailyDiscount/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, {
        headers: authHeaders(),
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load daily discounts')
    }
  },
)
export const updateDailyDiscount = createAsyncThunk(
  'dailyDiscount/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/${id}`, payload, {
        headers: authHeaders(),
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update daily discount')
    }
  },
)
export const updateDailyDiscountStatus = createAsyncThunk(
  'dailyDiscount/updateStatus',
  async ({ id, active }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/${id}/status`, null, {
        params: { active },
        headers: authHeaders(),
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status')
    }
  },
)
export const deleteDailyDiscount = createAsyncThunk(
  'dailyDiscount/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`, {
        headers: authHeaders(),
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete daily discount')
    }
  },
)
const dailyDiscountSlice = createSlice({
  name: 'dailyDiscount',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllDailyDiscounts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllDailyDiscounts.fulfilled, (state, action) => {
        state.loading = false
        state.discounts = action.payload
      })
      .addCase(getAllDailyDiscounts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createDailyDiscount.pending, (state) => {
        state.loading = true
        state.error = null
        state.discountCreated = false
      })
      .addCase(createDailyDiscount.fulfilled, (state, action) => {
        state.loading = false
        state.discountCreated = true
        state.discounts.push(action.payload)
      })
      .addCase(createDailyDiscount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateDailyDiscount.pending, (state) => {
        state.loading = true
        state.error = null
        state.discountUpdated = false
      })
      .addCase(updateDailyDiscount.fulfilled, (state, action) => {
        state.loading = false
        state.discountUpdated = true
        const index = state.discounts.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) state.discounts[index] = action.payload
      })
      .addCase(updateDailyDiscount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateDailyDiscountStatus.fulfilled, (state, action) => {
        const index = state.discounts.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) state.discounts[index] = action.payload
      })
      .addCase(deleteDailyDiscount.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteDailyDiscount.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.status) {
          state.discounts = state.discounts.filter((item) => item.id !== action.meta.arg)
        }
      })
      .addCase(deleteDailyDiscount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})
export default dailyDiscountSlice.reducer
