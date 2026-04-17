import { createSlice, createAsyncThunk } from '../../context/miniToolkit.js'
import { api } from '../../config/Api'
import { getSellerToken } from '../../utils/authToken'
import { decrementProductQuantitiesAfterPurchase } from '../customer/ProductSlice'
const API_URL = '/api/sellers/products'
const getErrorMessage = (payload, fallback) => {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }
  if (payload && typeof payload === 'object') {
    const record = payload
    if (typeof record.message === 'string' && record.message.trim()) {
      return record.message
    }
    if (typeof record.error === 'string' && record.error.trim()) {
      return record.error
    }
  }
  return fallback
}

const normalizeProductId = (value) => {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

const normalizeQuantity = (value) => {
  const quantity = Number(value)
  if (!Number.isFinite(quantity)) return 0
  return quantity > 0 ? quantity : 0
}
export const fetchSellerProducts = createAsyncThunk(
  'sellerProduct/fetchSellerProducts',
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      console.log('seller products ', response.data)
      return response.data
    } catch (error) {
      console.log('error ', error.response)
      return rejectWithValue(error.response.data)
    }
  },
)
export const createProduct = createAsyncThunk(
  'sellerProduct/createProduct',
  async ({ request, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL, request, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      console.log('product created ', response.data)
      return response.data
    } catch (error) {
      console.log('error ', error.response)
      return rejectWithValue(error.response.data)
    }
  },
)
export const updateProduct = createAsyncThunk(
  'sellerProduct/updateProduct',
  async ({ productId, product }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/${productId}`, product, {
        headers: { Authorization: `Bearer ${getSellerToken()}` },
      })
      console.log('product updated ', response.data)
      return response.data
    } catch (error) {
      console.log('error ', error)
      return rejectWithValue(error.response.data)
    }
  },
)
export const updateProductStock = createAsyncThunk(
  'sellerProduct/updateProductStock',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `${API_URL}/${productId}/stock`,
        {},
        {
          headers: { Authorization: `Bearer ${getSellerToken()}` },
        },
      )
      console.log('product stock updated ', response.data)
      return response.data
    } catch (error) {
      console.log('error ', error)
      return rejectWithValue(error.response.data)
    }
  },
)
export const deleteProduct = createAsyncThunk(
  'sellerProduct/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${getSellerToken()}` },
      })
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)
const initialState = {
  products: [],
  loading: false,
  error: null,
  productCreated: false,
}
const sellerProductSlice = createSlice({
  name: 'sellerProduct',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true
        state.error = null
        state.productCreated = false
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.products = action.payload
        state.loading = false
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(
          action.payload,
          action.error.message || 'Failed to fetch products',
        )
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
        state.productCreated = false
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload)
        state.loading = false
        state.productCreated = true
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(
          action.payload,
          action.error.message || 'Failed to create product',
        )
        state.productCreated = false
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        state.loading = false
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(
          action.payload,
          action.error.message || 'Failed to update product',
        )
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        state.loading = false
      })
      .addCase(decrementProductQuantitiesAfterPurchase, (state, action) => {
        if (!Array.isArray(action.payload) || !action.payload.length) return

        const purchasedMap = action.payload.reduce((acc, item) => {
          const productId = normalizeProductId(
            item?.productId ?? item?.product?.id ?? item?.product?.productId,
          )
          const quantity = normalizeQuantity(item?.quantity ?? item?.qty)

          if (!productId || quantity <= 0) return acc

          acc[productId] = (acc[productId] ?? 0) + quantity
          return acc
        }, {})

        if (!Object.keys(purchasedMap).length) return

        state.products = state.products.map((product) => {
          const productId = normalizeProductId(product?.id ?? product?.productId)
          if (!productId || !purchasedMap[productId]) return product

          const nextQuantity = Math.max(
            0,
            normalizeQuantity(product?.quantity) - purchasedMap[productId],
          )

          return {
            ...product,
            quantity: nextQuantity,
            in_stock: nextQuantity > 0,
          }
        })
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.meta.arg)
        state.loading = false
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(
          action.payload,
          action.error.message || 'Failed to delete product',
        )
      })
  },
})
export default sellerProductSlice.reducer
