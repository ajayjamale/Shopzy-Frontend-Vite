// src/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '../../context/miniToolkit.js'
import { api } from '../../config/Api'
import { resetUserState } from './UserSlice'
import { resetCartState } from './CartSlice'
const initialState = {
  jwt: null,
  role: null,
  loading: false,
  error: null,
  otpSent: false,
}
// Define the base URL for the API
const API_URL = '/api/auth'
export const sendLoginSignupOtp = createAsyncThunk(
  'auth/sendLoginSignupOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/otp/login-signup/send`, { email })
      console.log('otp sent successfully', response.data)
      return response.data
    } catch (error) {
      console.log('error', error.response)
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.error || 'Failed to send OTP',
      )
    }
  },
)
export const signup = createAsyncThunk(
  'auth/signup',
  async (signupRequest, { rejectWithValue }) => {
    console.log('signup ', signupRequest)
    try {
      const response = await api.post(`${API_URL}/signup`, signupRequest)
      signupRequest.navigate('/')
      localStorage.setItem('jwt', response.data.jwt)
      return response.data
    } catch (error) {
      return rejectWithValue('Signup failed')
    }
  },
)
export const signin = createAsyncThunk('auth/signin', async (loginRequest, { rejectWithValue }) => {
  try {
    const response = await api.post(`${API_URL}/signin`, loginRequest)
    console.log('login successful', response.data)
    localStorage.setItem('jwt', response.data.jwt)
    loginRequest.navigate('/')
    return response.data
  } catch (error) {
    console.log('error ', error.response)
    return rejectWithValue(
      error.response?.data?.message || error.response?.data?.error || 'Signin failed',
    )
  }
})
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/reset-password`, resetPasswordRequest)
      return response.data
    } catch (error) {
      return rejectWithValue('Reset password failed')
    }
  },
)
export const resetPasswordRequest = createAsyncThunk(
  'auth/resetPasswordRequest',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/reset-password-request`, { email })
      return response.data
    } catch (error) {
      return rejectWithValue('Reset password request failed')
    }
  },
)
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.jwt = null
      state.role = null
      state.otpSent = false
      state.error = null
      localStorage.clear()
    },
    resetOtpState: (state) => {
      state.otpSent = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendLoginSignupOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendLoginSignupOtp.fulfilled, (state) => {
        state.loading = false
        state.otpSent = true
      })
      .addCase(sendLoginSignupOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.jwt = action.payload.jwt
        state.role = action.payload.role
        state.loading = false
        state.otpSent = false
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(signin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.jwt = action.payload.jwt
        state.role = action.payload.role
        state.loading = false
        state.otpSent = false
        state.error = null
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(resetPasswordRequest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPasswordRequest.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPasswordRequest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})
export const { logout, resetOtpState } = authSlice.actions
export default authSlice.reducer
export const performLogout = () => async (dispatch) => {
  dispatch(logout())
  dispatch(resetUserState())
  dispatch(resetCartState())
}
export const selectAuth = (state) => state.auth
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
