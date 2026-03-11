import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";

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

export const chatBot = createAsyncThunk<
  any,
  { prompt: any; productId: number | null | undefined; userId: number | null }
>(
  "aiChatBot/generateResponse",
  async ({ prompt, productId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/ai/chat", prompt, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        params: {
          userId,
          productId,
        },
      });
      console.log("chatbot response:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("chatbot error:", error.response);
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate chatbot response"
      );
    }
  }
);

const aiChatBotSlice = createSlice({
  name: "aiChatBot",
  initialState,
  reducers: {
    // Optional: clear chat history
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

        // ✅ Add user message to chat immediately
        const { prompt } = action.meta.arg;
        const userMessage: Message = {
          message: prompt.prompt,
          role: "user",
        };
        state.messages = [...state.messages, userMessage];
      })

      .addCase(chatBot.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;

        // ✅ Extract the text from ApiResponse and set role to "model"
        const botMessage: Message = {
          message: action.payload.message, // <-- was: action.payload (whole object)
          role: "model",
        };
        state.messages = [...state.messages, botMessage];
      })

      .addCase(chatBot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;

        // ✅ Show error as a bot message so user sees feedback in chat
        const errorMessage: Message = {
          message: "Sorry, something went wrong. Please try again.",
          role: "model",
        };
        state.messages = [...state.messages, errorMessage];
      });
  },
});

export const { clearMessages } = aiChatBotSlice.actions;
export default aiChatBotSlice.reducer;