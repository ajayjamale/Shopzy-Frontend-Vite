import { createSlice, createAsyncThunk } from '../../context/miniToolkit.js'
import { api } from '../../config/Api'
const initialState = {
  items: [],
  current: null,
  summary: null,
  loading: false,
  error: null,
  page: 0,
  size: 10,
  total: 0,
  totalPages: 0,
  filters: {},
}
const buildQueryParams = (query) => {
  const params = {}
  if (!query) return params
  const { status, sellerId, fromDate, toDate, page, size, sort } = query
  if (status) params.status = status
  if (sellerId) params.sellerId = sellerId
  if (fromDate) params.fromDate = fromDate
  if (toDate) params.toDate = toDate
  if (page !== undefined) params.page = page
  if (size !== undefined) params.size = size
  if (sort) params.sort = sort
  return params
}
export const fetchSettlements = createAsyncThunk(
  'settlements/fetchSettlements',
  async ({ jwt, query }, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/settlements', {
        headers: { Authorization: `Bearer ${jwt}` },
        params: buildQueryParams(query),
      })
      return response.data
    } catch (error) {
      if (error.response)
        return rejectWithValue(error.response.data?.message || 'Failed to load settlements')
      return rejectWithValue('Failed to load settlements')
    }
  },
)
export const fetchSettlementById = createAsyncThunk(
  'settlements/fetchSettlementById',
  async ({ jwt, id }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/settlements/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      return response.data
    } catch (error) {
      if (error.response)
        return rejectWithValue(error.response.data?.message || 'Failed to load settlement')
      return rejectWithValue('Failed to load settlement')
    }
  },
)
export const createSettlement = createAsyncThunk(
  'settlements/createSettlement',
  async ({ jwt, payload }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/settlements', payload, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      return response.data
    } catch (error) {
      if (error.response)
        return rejectWithValue(error.response.data?.message || 'Failed to create settlement')
      return rejectWithValue('Failed to create settlement')
    }
  },
)
export const updateSettlementStatus = createAsyncThunk(
  'settlements/updateSettlementStatus',
  async ({ jwt, id, status, remarks }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/settlements/${id}/status`,
        { status, remarks },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      )
      return response.data
    } catch (error) {
      if (error.response)
        return rejectWithValue(error.response.data?.message || 'Failed to update status')
      return rejectWithValue('Failed to update status')
    }
  },
)
export const fetchSettlementSummary = createAsyncThunk(
  'settlements/fetchSettlementSummary',
  async ({ jwt, query }, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/settlements/summary', {
        headers: { Authorization: `Bearer ${jwt}` },
        params: buildQueryParams(query),
      })
      return response.data
    } catch (error) {
      if (error.response)
        return rejectWithValue(error.response.data?.message || 'Failed to load summary')
      return rejectWithValue('Failed to load summary')
    }
  },
)
const normaliseListResponse = (payload) => {
  const list = Array.isArray(payload)
    ? payload
    : payload.content || payload.items || payload.data || []
  const meta = Array.isArray(payload)
    ? { total: list.length, totalPages: 1, page: 0, size: list.length }
    : {
        total: payload.totalElements ?? list.length,
        totalPages: payload.totalPages ?? 1,
        page: payload.page ?? 0,
        size: payload.size ?? list.length,
      }
  const summary = Array.isArray(payload) ? null : (payload.summary ?? null)
  return { list, meta, summary }
}
const settlementSlice = createSlice({
  name: 'settlements',
  initialState,
  reducers: {
    setSettlementFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearSettlementError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettlements.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSettlements.fulfilled, (state, action) => {
        const { list, meta, summary } = normaliseListResponse(action.payload)
        state.loading = false
        state.items = list
        state.page = meta.page
        state.size = meta.size
        state.total = meta.total
        state.totalPages = meta.totalPages
        if (summary) state.summary = summary
      })
      .addCase(fetchSettlements.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchSettlementById.pending, (state) => {
        state.loading = true
        state.error = null
        state.current = null
      })
      .addCase(fetchSettlementById.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload
      })
      .addCase(fetchSettlementById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createSettlement.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createSettlement.fulfilled, (state, action) => {
        state.loading = false
        state.items = [action.payload, ...state.items]
        state.total += 1
      })
      .addCase(createSettlement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateSettlementStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSettlementStatus.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.map((s) => (s.id === action.payload.id ? action.payload : s))
        if (state.current?.id === action.payload.id) {
          state.current = action.payload
        }
      })
      .addCase(updateSettlementStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchSettlementSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSettlementSummary.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload
      })
      .addCase(fetchSettlementSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})
export const { setSettlementFilters, clearSettlementError } = settlementSlice.actions
export default settlementSlice.reducer
