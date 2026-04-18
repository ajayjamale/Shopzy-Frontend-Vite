import { createSlice, createAsyncThunk } from '../../context/miniToolkit.js'
import { api } from '../../config/Api'
import { getCustomerToken, getSellerToken } from '../../utils/authToken'
const initialState = {
  response: null,
  loading: false,
  error: null,
  messages: [],
}
const getPromptText = (prompt) => {
  if (typeof prompt === 'string') return prompt.trim()
  if (typeof prompt?.prompt === 'string') return prompt.prompt.trim()
  return ''
}
const parseJwtPayload = (token) => {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}
const getSafeAuthToken = (mode) => {
  const token = mode === 'seller' ? getSellerToken() : getCustomerToken()
  if (!token) return ''
  const payload = parseJwtPayload(token)
  if (!payload) return ''
  const exp = Number(payload.exp || 0)
  if (exp && exp * 1000 <= Date.now()) {
    return ''
  }
  return token
}
const extractErrorText = (raw) => {
  if (!raw) return ''
  if (typeof raw === 'string') return raw
  if (typeof raw?.message === 'string') return raw.message
  if (typeof raw?.error === 'string') return raw.error
  if (typeof raw?.details === 'string') return raw.details
  if (typeof raw?.data?.message === 'string') return raw.data.message
  if (typeof raw?.data?.error === 'string') return raw.data.error
  return ''
}
const normalizeChatError = (raw) => {
  const text = extractErrorText(raw).trim()
  const lower = text.toLowerCase()
  if (!text) {
    return 'Chat service is temporarily unavailable. Please try again.'
  }
  if (lower.includes('401') || lower.includes('unauthorized')) {
    return 'Chat service authentication failed on the server. Please try again shortly.'
  }
  if (
    lower.includes('asyncrequestnotusableexception') ||
    lower.includes('connection was aborted')
  ) {
    return 'Connection was interrupted while generating the reply. Please retry.'
  }
  return text
}
const extractModelMessage = (payload) => {
  if (!payload) return 'Sorry, I could not generate a response right now.'
  if (typeof payload === 'string') return normalizeChatError(payload)
  if (typeof payload.message === 'string') return normalizeChatError(payload.message)
  if (typeof payload.response === 'string') return normalizeChatError(payload.response)
  if (typeof payload.answer === 'string') return normalizeChatError(payload.answer)
  if (typeof payload.text === 'string') return normalizeChatError(payload.text)
  if (typeof payload.content === 'string') return normalizeChatError(payload.content)
  if (typeof payload.data?.message === 'string') return normalizeChatError(payload.data.message)
  const candidateText = payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || '')
    .join(' ')
    .trim()
  if (candidateText) return normalizeChatError(candidateText)
  return 'Sorry, I could not generate a response right now.'
}
export const chatBot = createAsyncThunk(
  'aiChatBot/generateResponse',
  async ({ prompt, productId, userId, mode }, { rejectWithValue }) => {
    const promptText = getPromptText(prompt)
    if (!promptText) return rejectWithValue('Prompt is required')
    const selectedMode = mode === 'seller' ? 'seller' : 'customer'
    const guestHeaders = {
      'Content-Type': 'application/json',
    }
    const headers = { ...guestHeaders }
    const token = getSafeAuthToken(selectedMode)
    if (token) {
      headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }
    const baseParams = {}
    if (productId !== null && productId !== undefined) baseParams.productId = productId
    baseParams.mode = selectedMode
    // User context is resolved by backend from Authorization header when present.
    void userId
    const payload = { prompt: promptText }
    const requestChat = async (path, params, requestHeaders = headers) => {
      const response = await api.post(path, payload, {
        headers: requestHeaders,
        params,
      })
      return response.data
    }
    try {
      return await requestChat('/ai/chat', baseParams)
    } catch (error) {
      if (error?.response?.status === 401 && token) {
        try {
          return await requestChat('/ai/chat', baseParams, guestHeaders)
        } catch {
          // Keep flowing to unified error handling.
        }
      }
      if (error?.response?.status === 404) {
        return rejectWithValue(
          'Chat endpoint not found. Restart the Vite dev server so /ai proxy changes are applied.',
        )
      }
      return rejectWithValue(normalizeChatError(error.response?.data || error))
    }
  },
)
const aiChatBotSlice = createSlice({
  name: 'aiChatBot',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = []
      state.response = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(chatBot.pending, (state, action) => {
        state.loading = true
        state.error = null
        const promptText = getPromptText(action.meta.arg.prompt)
        if (!promptText) return
        const userMessage = {
          message: promptText,
          role: 'user',
        }
        state.messages = [...state.messages, userMessage]
      })
      .addCase(chatBot.fulfilled, (state, action) => {
        state.loading = false
        state.response = extractModelMessage(action.payload)
        const botMessage = {
          message: extractModelMessage(action.payload),
          role: 'model',
        }
        state.messages = [...state.messages, botMessage]
      })
      .addCase(chatBot.rejected, (state, action) => {
        state.loading = false
        state.error = normalizeChatError(action.payload)
        const fallbackMessage =
          normalizeChatError(action.payload) || 'Sorry, something went wrong. Please try again.'
        const errorMessage = {
          message: fallbackMessage,
          role: 'model',
        }
        state.messages = [...state.messages, errorMessage]
      })
  },
})
export const { clearMessages } = aiChatBotSlice.actions
export default aiChatBotSlice.reducer
