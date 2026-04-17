import { createSlice, createAsyncThunk } from '../../context/miniToolkit.js'
import { api } from '../../config/Api'
const API_URL = '/products'
// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  product: null,
  products: [],
  paginatedProducts: null,
  totalPages: 1,
  loading: false,
  error: null,
  searchProduct: [],
}
// ─── Thunks ───────────────────────────────────────────────────────────────────
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${productId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data ?? 'Failed to fetch product')
    }
  },
)
export const searchProduct = createAsyncThunk(
  'products/searchProduct',
  async (query, { rejectWithValue }) => {
    try {
      const normalizedQuery = query.trim()
      if (!normalizedQuery) {
        return []
      }
      const response = await api.get(`${API_URL}/search`, {
        params: { query: normalizedQuery },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data ?? 'Failed to search products')
    }
  },
)
export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, {
        params: {
          ...params,
          pageNumber: params.pageNumber ?? 0,
        },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data ?? 'Failed to fetch products')
    }
  },
)
// ─── Slice ────────────────────────────────────────────────────────────────────
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    decrementProductQuantitiesAfterPurchase: (state, action) => {
      if (!action.payload.length) return
      const purchasedMap = action.payload.reduce((acc, item) => {
        const productId = Number(item.productId)
        const quantity = Number(item.quantity)
        if (!Number.isFinite(productId) || productId <= 0) return acc
        if (!Number.isFinite(quantity) || quantity <= 0) return acc
        acc[productId] = (acc[productId] ?? 0) + quantity
        return acc
      }, {})
      const updateProductQuantity = (product) => {
        const productId = Number(product?.id)
        if (!productId || !purchasedMap[productId]) return product
        const nextQuantity = Math.max(0, Number(product.quantity ?? 0) - purchasedMap[productId])
        return {
          ...product,
          quantity: nextQuantity,
          in_stock: nextQuantity > 0,
        }
      }
      if (state.product) {
        state.product = updateProductQuantity(state.product)
      }
      state.products = state.products.map(updateProductQuantity)
      state.searchProduct = state.searchProduct.map(updateProductQuantity)
      if (state.paginatedProducts) {
        state.paginatedProducts.content = state.paginatedProducts.content.map(updateProductQuantity)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload
        state.loading = false
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch product'
      })
      // searchProduct
      .addCase(searchProduct.pending, (state) => {
        state.loading = true
        state.error = null
        state.searchProduct = []
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.searchProduct = action.payload
        state.loading = false
      })
      .addCase(searchProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to search products'
      })
      // getAllProducts
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.paginatedProducts = action.payload
        state.products = action.payload.content
        state.totalPages = action.payload.totalPages
        state.loading = false
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch products'
      })
  },
})
export default productSlice.reducer
export const { decrementProductQuantitiesAfterPurchase } = productSlice.actions
// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectProduct = (state) => state.products.product
export const selectProducts = (state) => state.products.products
export const selectPaginatedProducts = (state) => state.products.paginatedProducts
export const selectTotalPages = (state) => state.products.totalPages
export const selectProductLoading = (state) => state.products.loading
export const selectProductError = (state) => state.products.error
export const selectSearchProducts = (state) => state.products.searchProduct
