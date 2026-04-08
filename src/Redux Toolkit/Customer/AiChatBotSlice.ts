import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import { getCustomerToken, getSellerToken } from "../../util/authToken";

export type ChatBotMode = "customer" | "seller";

interface Message {
  message: string;
  role: "user" | "model";
}

interface AiChatBotState {
  response: string | null;
  loading: boolean;
  error: string | null;
  messages: Message[];
}

const initialState: AiChatBotState = {
  response: null,
  loading: false,
  error: null,
  messages: [],
};

const getPromptText = (prompt: any): string => {
  if (typeof prompt === "string") return prompt.trim();
  if (typeof prompt?.prompt === "string") return prompt.prompt.trim();
  return "";
};

const parseJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const getSafeAuthToken = (mode: ChatBotMode): string => {
  const token = mode === "seller" ? getSellerToken() : getCustomerToken();
  if (!token) return "";

  const payload = parseJwtPayload(token);
  if (!payload) return "";

  const exp = Number(payload.exp || 0);
  if (exp && exp * 1000 <= Date.now()) {
    return "";
  }

  return token;
};

const extractErrorText = (raw: any): string => {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw?.message === "string") return raw.message;
  if (typeof raw?.error === "string") return raw.error;
  if (typeof raw?.details === "string") return raw.details;
  if (typeof raw?.data?.message === "string") return raw.data.message;
  if (typeof raw?.data?.error === "string") return raw.data.error;
  return "";
};

const normalizeChatError = (raw: any): string => {
  const text = extractErrorText(raw).trim();
  const lower = text.toLowerCase();

  if (!text) {
    return "Chat service is temporarily unavailable. Please try again.";
  }

  if (lower.includes("401") || lower.includes("unauthorized")) {
    return "Chat service authentication failed on the server. Please try again shortly.";
  }

  if (lower.includes("asyncrequestnotusableexception") || lower.includes("connection was aborted")) {
    return "Connection was interrupted while generating the reply. Please retry.";
  }

  return text;
};

const extractModelMessage = (payload: any): string => {
  if (!payload) return "Sorry, I could not generate a response right now.";
  if (typeof payload === "string") return normalizeChatError(payload);
  if (typeof payload.message === "string") return normalizeChatError(payload.message);
  if (typeof payload.response === "string") return normalizeChatError(payload.response);
  if (typeof payload.answer === "string") return normalizeChatError(payload.answer);
  if (typeof payload.text === "string") return normalizeChatError(payload.text);
  if (typeof payload.content === "string") return normalizeChatError(payload.content);
  if (typeof payload.data?.message === "string") return normalizeChatError(payload.data.message);

  const candidateText = payload?.candidates?.[0]?.content?.parts
    ?.map((part: any) => part?.text || "")
    .join(" ")
    .trim();
  if (candidateText) return normalizeChatError(candidateText);

  return "Sorry, I could not generate a response right now.";
};

export const chatBot = createAsyncThunk<
  any,
  { prompt: any; productId: number | null | undefined; userId: number | null; mode?: ChatBotMode }
>(
  "aiChatBot/generateResponse",
  async ({ prompt, productId, userId, mode }, { rejectWithValue }) => {
    const promptText = getPromptText(prompt);
    if (!promptText) return rejectWithValue("Prompt is required");
    const selectedMode: ChatBotMode = mode === "seller" ? "seller" : "customer";

    const guestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const headers: Record<string, string> = { ...guestHeaders };
    const token = getSafeAuthToken(selectedMode);
    if (token) {
      headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    const baseParams: Record<string, string | number> = {};
    if (productId !== null && productId !== undefined) baseParams.productId = productId;
    baseParams.mode = selectedMode;
    // User context is resolved by backend from Authorization header when present.
    void userId;

    const payload = { prompt: promptText };

    const requestChat = async (
      path: string,
      params: Record<string, string | number>,
      requestHeaders: Record<string, string> = headers
    ) => {
      const response = await api.post(path, payload, {
        headers: requestHeaders,
        params,
      });
      return response.data;
    };

    try {
      return await requestChat("/ai/chat", baseParams);
    } catch (error: any) {
      if (error?.response?.status === 401 && token) {
        try {
          return await requestChat("/ai/chat", baseParams, guestHeaders);
        } catch {
          // Keep flowing to existing fallback paths.
        }
      }

      if (error?.response?.status === 500 || error?.response?.status === 404) {
        try {
          return await requestChat("/api/ai/chat", baseParams);
        } catch (retryError: any) {
          return rejectWithValue(normalizeChatError(retryError.response?.data || retryError));
        }
      }

      return rejectWithValue(normalizeChatError(error.response?.data || error));
    }
  }
);

const aiChatBotSlice = createSlice({
  name: "aiChatBot",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.response = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(chatBot.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        const promptText = getPromptText(action.meta.arg.prompt);
        if (!promptText) return;

        const userMessage: Message = {
          message: promptText,
          role: "user",
        };
        state.messages = [...state.messages, userMessage];
      })
      .addCase(chatBot.fulfilled, (state, action) => {
        state.loading = false;
        state.response = extractModelMessage(action.payload);

        const botMessage: Message = {
          message: extractModelMessage(action.payload),
          role: "model",
        };
        state.messages = [...state.messages, botMessage];
      })
      .addCase(chatBot.rejected, (state, action) => {
        state.loading = false;
        state.error = normalizeChatError(action.payload as string);

        const fallbackMessage =
          normalizeChatError(action.payload as string) ||
          "Sorry, something went wrong. Please try again.";

        const errorMessage: Message = {
          message: fallbackMessage,
          role: "model",
        };
        state.messages = [...state.messages, errorMessage];
      });
  },
});

export const { clearMessages } = aiChatBotSlice.actions;
export default aiChatBotSlice.reducer;
