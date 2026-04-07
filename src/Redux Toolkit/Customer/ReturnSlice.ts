import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { ReturnRequest, ReturnStatus } from "../../types/orderTypes";

interface ReturnState {
  requests: ReturnRequest[];
  loading: boolean;
  error: string | null;
  lastCreated?: ReturnRequest | null;
}

const initialState: ReturnState = {
  requests: [],
  loading: false,
  error: null,
  lastCreated: null,
};

export const requestReturn = createAsyncThunk<
  ReturnRequest,
  { jwt: string; payload: ReturnRequest },
  { rejectValue: string }
>("returns/requestReturn", async ({ jwt, payload }, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/returns", payload, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to submit return request";
    return rejectWithValue(message);
  }
});

export const fetchReturnRequests = createAsyncThunk<
  ReturnRequest[],
  { jwt: string },
  { rejectValue: string }
>("returns/fetchReturnRequests", async ({ jwt }, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/returns", {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Failed to load return requests");
  }
});

export const updateReturnStatus = createAsyncThunk<
  ReturnRequest,
  { jwt: string; id: number; status: ReturnStatus; adminComment?: string },
  { rejectValue: string }
>("returns/updateReturnStatus", async ({ jwt, id, status, adminComment }, { rejectWithValue }) => {
  try {
    const response = await api.put(
      `/api/returns/${id}/status`,
      { status, adminComment },
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Failed to update return status");
  }
});

const returnSlice = createSlice({
  name: "returns",
  initialState,
  reducers: {
    clearReturnError: (state) => {
      state.error = null;
    },
    clearReturnFeedback: (state) => {
      state.error = null;
      state.lastCreated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastCreated = null;
      })
      .addCase(requestReturn.fulfilled, (state, action: PayloadAction<ReturnRequest>) => {
        state.loading = false;
        state.lastCreated = action.payload;
        state.requests = [action.payload, ...state.requests];
      })
      .addCase(requestReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchReturnRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReturnRequests.fulfilled, (state, action: PayloadAction<ReturnRequest[]>) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchReturnRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateReturnStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReturnStatus.fulfilled, (state, action: PayloadAction<ReturnRequest>) => {
        state.loading = false;
        state.requests = state.requests.map((req) =>
          req.id === action.payload.id ? action.payload : req
        );
        if (state.lastCreated?.id === action.payload.id) {
          state.lastCreated = action.payload;
        }
      })
      .addCase(updateReturnStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReturnError, clearReturnFeedback } = returnSlice.actions;
export default returnSlice.reducer;
