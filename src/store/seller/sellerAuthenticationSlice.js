import { createSlice, createAsyncThunk } from '../../context/miniToolkit.js'
import { api } from '../../config/Api'
import axios from 'axios'
const initialState = {
  otpSent: false,
  error: null,
  loading: false,
  jwt: null,
  sellerCreated: null,
}
const API_URL = '/api/sellers'
// Define async thunks for sending and verifying OTP
export const sendLoginOtp = createAsyncThunk(
  'otp/sendLoginOtp',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`${API_URL}/auth/login-otp/send`, { email })
      console.log('otp sent - ', email, data)
      return { email }
    } catch (error) {
      console.log('error', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP')
    }
  },
)
export const verifyLoginOtp = createAsyncThunk(
  'otp/verifyLoginOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/auth/login-otp/verify`, {
        email: data.email,
        otp: data.otp,
      })
      const jwt = response.data?.jwt
      if (!jwt) {
        return rejectWithValue('Seller login failed. Please try again.')
      }
      const profileResponse = await api.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      const accountStatus = profileResponse.data?.accountStatus?.toUpperCase?.() || ''
      if (accountStatus !== 'ACTIVE') {
        localStorage.removeItem('seller_jwt')
        if (accountStatus === 'PENDING_VERIFICATION') {
          return rejectWithValue(
            'Your seller account is pending verification. Please wait for admin approval.',
          )
        }
        if (accountStatus) {
          const readableStatus = accountStatus.toLowerCase().replace(/_/g, ' ')
          return rejectWithValue(`Seller account is ${readableStatus}. Please contact support.`)
        }
        return rejectWithValue('Seller account is not active yet.')
      }
      console.log('login seller success - ', response.data)
      // Store seller token under a seller-specific key to avoid clashing with customer JWT
      localStorage.setItem('seller_jwt', jwt)
      data.navigate('/seller')
      return response.data
    } catch (error) {
      console.log('error', error.response?.data)
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP')
    }
  },
)
export const createSeller = createAsyncThunk(
  'sellers/createSeller',
  async (seller, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL, seller)
      console.log('create seller', response.data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Create seller error response data:', error.response.data)
        console.error('Create seller error response status:', error.response.status)
        console.error('Create seller error response headers:', error.response.headers)
        return rejectWithValue(error.message)
      } else {
        console.error('Create seller error message:', error.message)
        return rejectWithValue('Failed to create seller')
      }
    }
  },
)
// Create the slice
const sellerAuthSlice = createSlice({
  name: 'sellerAuth',
  initialState,
  reducers: {
    resetSellerAuthState: (state) => {
      state.otpSent = false
      state.error = null
      state.loading = false
      state.jwt = null
      state.sellerCreated = null
    },
  },
  extraReducers: (builder) => {
    // Handle sendLoginOtp actions
    builder
      .addCase(sendLoginOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendLoginOtp.fulfilled, (state) => {
        state.loading = false
        state.otpSent = true
        state.error = null
      })
      .addCase(sendLoginOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    // Handle verifyLoginOtp actions
    builder
      .addCase(verifyLoginOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.loading = false
        state.jwt = action.payload.jwt
        state.error = null
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // create new seller
      .addCase(createSeller.pending, (state) => {
        state.loading = true
        state.error = null
        state.sellerCreated = null
      })
      .addCase(createSeller.fulfilled, (state, action) => {
        // state.sellers.push(action.payload);
        const status = action.payload.accountStatus?.toUpperCase?.()
        state.sellerCreated =
          status === 'PENDING_VERIFICATION'
            ? 'Seller account created. It is pending admin verification.'
            : 'Seller account created successfully.'
        state.loading = false
      })
      .addCase(createSeller.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to create seller'
      })
  },
})
// Export actions and reducer
export const { resetSellerAuthState } = sellerAuthSlice.actions
export default sellerAuthSlice.reducer
