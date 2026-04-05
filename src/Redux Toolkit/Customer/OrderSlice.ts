// src/slices/orderSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../Config/Api";
import type { Order, OrderItem, OrderState } from "../../types/orderTypes";
import type { Address } from "../../types/userTypes";
import type { ApiResponse } from "../../types/authTypes";
import type { RootState } from "../Store";

const initialState: OrderState = {
  orders: [],
  orderItem: null,
  currentOrder: null,
  paymentOrder: null,
  loading: false,
  error: null,
  orderCanceled: false,
  paymentConfirmed: false,
};

const API_URL = "/api/orders";

// Fetch user order history
export const fetchUserOrderHistory = createAsyncThunk<Order[], string>(
  "orders/fetchUserOrderHistory",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get<Order[]>(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch order history");
    }
  }
);

// Fetch order by ID
export const fetchOrderById = createAsyncThunk<Order, { orderId: number; jwt: string }>(
  "orders/fetchOrderById",
  async ({ orderId, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get<Order>(`${API_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch order");
    }
  }
);

// Create a new order and return the payment link.
// FIX: Removed window.location.href from the thunk.
// A Redux thunk must NOT perform browser navigation — it's a pure data layer.
// Reasons this was causing the bug:
//   1. If payment_link_url was undefined/null in the response, the redirect
//      never happened but the thunk still returned successfully. The component
//      had no way to know the redirect failed.
//   2. The component called dispatch() synchronously (no await), so by the time
//      the async thunk resolved and tried to redirect, React may have already
//      re-rendered or unmounted the component.
//   3. Putting navigation in a thunk makes it impossible to test and impossible
//      for the component to handle errors gracefully.
//
// The component (AddressPage) now awaits the result via .unwrap() and performs
// the redirect itself — giving full control and error handling to the UI layer.
export const createOrder = createAsyncThunk<
  any,
  { address: Address; jwt: string; paymentGateway: string }
>("orders/createOrder", async ({ address, jwt, paymentGateway }, { rejectWithValue }) => {
  try {
    const response = await api.post<any>(API_URL, address, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { paymentMethod: paymentGateway },
    });

    console.log("createOrder raw response:", response.data);

    const data = response.data ?? {};
    const paymentUrl =
      data.payment_link_url ||
      data.paymentLinkUrl ||
      data.payment_url ||
      data.paymentUrl ||
      data?.paymentLink?.shortUrl ||
      data?.paymentLink?.short_url ||
      data?.paymentLink?.longUrl ||
      data?.paymentLink?.long_url ||
      data?.payment_link?.short_url ||
      data?.payment_link?.long_url;

    // Check for a usable payment URL — log full response so we can see
    // the exact field names the backend returns
    if (!paymentUrl) {
      console.error(
        "payment_link_url missing. Backend returned:",
        JSON.stringify(data, null, 2)
      );
      return rejectWithValue(
        "Order created but payment_link_url missing. See console for backend response."
      );
    }

    return { ...data, payment_link_url: paymentUrl };
  } catch (error: any) {
    // Log the full error so we can see HTTP status, headers, and body
    console.error("createOrder error status :", error.response?.status);
    console.error("createOrder error body   :", error.response?.data);
    console.error("createOrder error message:", error.message);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error  ||
      error.response?.data         ||
      error.message                ||
      "Failed to create order";

    return rejectWithValue(message);
  }
});

export const fetchOrderItemById = createAsyncThunk<
  OrderItem,
  { orderItemId: number; jwt: string }
>("orders/fetchOrderItemById", async ({ orderItemId, jwt }, { rejectWithValue }) => {
  try {
    const response = await api.get<OrderItem>(`${API_URL}/item/${orderItemId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue("Failed to fetch order item");
  }
});

// Called by Razorpay redirect — confirms payment and finalises the order
export const paymentSuccess = createAsyncThunk<
  ApiResponse,
  { paymentId: string; jwt: string; paymentLinkId: string },
  { rejectValue: string }
>("orders/paymentSuccess", async ({ paymentId, jwt, paymentLinkId }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/payment/${paymentId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { paymentLinkId },
    });
    console.log("payment success ", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to process payment");
  }
});

export const cancelOrder = createAsyncThunk<Order, any>(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An error occurred while cancelling the order.");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetPaymentConfirmed: (state) => {
      state.paymentConfirmed = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderCanceled = false;
      })
      .addCase(fetchUserOrderHistory.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.currentOrder = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentConfirmed = false;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.paymentOrder = action.payload;
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchOrderItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderItem = action.payload;
      })
      .addCase(fetchOrderItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(paymentSuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentConfirmed = false;
      })
      .addCase(paymentSuccess.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentConfirmed = true;
        state.currentOrder = action.payload as any;
      })
      .addCase(paymentSuccess.rejected, (state, action) => {
        state.loading = false;
        state.paymentConfirmed = false;
        state.error = action.payload as string;
      })

      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderCanceled = false;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        );
        state.orderCanceled = true;
        state.currentOrder = action.payload;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
export const { resetPaymentConfirmed } = orderSlice.actions;

export const selectOrders          = (state: RootState) => state.orders.orders;
export const selectCurrentOrder    = (state: RootState) => state.orders.currentOrder;
export const selectPaymentOrder    = (state: RootState) => state.orders.paymentOrder;
export const selectOrdersLoading   = (state: RootState) => state.orders.loading;
export const selectOrdersError     = (state: RootState) => state.orders.error;
export const selectPaymentConfirmed = (state: RootState) => state.orders.paymentConfirmed;
