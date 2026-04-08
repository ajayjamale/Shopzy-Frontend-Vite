import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../config/Api";
import type { Order, OrderItem, OrderState } from "../../types/orderTypes";
import type { Address } from "../../types/userTypes";
import type { ApiResponse } from "../../types/authTypes";
import type { RootState } from "../index";

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

export interface CheckoutInitPayload {
  payment_order_id: number;
  razorpay_order_id: string;
  razorpay_key: string;
  amount: number;
  currency: string;
  payment_link_url?: string;
}

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

export const createOrder = createAsyncThunk<
  CheckoutInitPayload,
  { address: Address; jwt: string; paymentGateway: string }
>("orders/createOrder", async ({ address, jwt, paymentGateway }, { rejectWithValue }) => {
  try {
    const response = await api.post<Record<string, any>>(API_URL, address, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { paymentMethod: paymentGateway },
    });

    const data = response.data ?? {};
    const paymentOrderId = Number(data.payment_order_id ?? data.paymentOrderId ?? 0);
    const razorpayOrderId = String(data.razorpay_order_id ?? data.razorpayOrderId ?? "");
    const razorpayKey = String(data.razorpay_key ?? data.razorpayKey ?? import.meta.env.VITE_RAZORPAY_KEY_ID ?? "");
    const amount = Number(data.amount ?? 0);
    const currency = String(data.currency ?? "INR");

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

    const hasCheckoutPayload =
      paymentOrderId > 0 &&
      razorpayOrderId.length > 0 &&
      razorpayKey.length > 0 &&
      Number.isFinite(amount) &&
      amount > 0;

    if (hasCheckoutPayload) {
      return {
        payment_order_id: paymentOrderId,
        razorpay_order_id: razorpayOrderId,
        razorpay_key: razorpayKey,
        amount,
        currency,
        payment_link_url: paymentUrl ? String(paymentUrl) : undefined,
      };
    }

    // Backward compatibility for payment-link based flow.
    if (paymentUrl) {
      return {
        payment_order_id: paymentOrderId,
        razorpay_order_id: "",
        razorpay_key: "",
        amount: 0,
        currency: "INR",
        payment_link_url: String(paymentUrl),
      };
    }

    console.error(
      "Razorpay checkout fields missing. Backend returned:",
      JSON.stringify(data, null, 2)
    );
    return rejectWithValue("Unable to initialize payment. Razorpay order details were not returned.");
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      error.message ||
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

export const verifyRazorpayPayment = createAsyncThunk<
  ApiResponse,
  {
    jwt: string;
    paymentOrderId: number;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  },
  { rejectValue: string }
>(
  "orders/verifyRazorpayPayment",
  async ({ jwt, paymentOrderId, razorpayPaymentId, razorpayOrderId, razorpaySignature }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/payments/verify",
        { paymentOrderId, razorpayPaymentId, razorpayOrderId, razorpaySignature },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data?.message || "Payment verification failed");
      return rejectWithValue("Failed to verify payment");
    }
  }
);

export const markPaymentFailed = createAsyncThunk<
  ApiResponse,
  { jwt: string; paymentOrderId: number; reason?: string },
  { rejectValue: string }
>("orders/markPaymentFailed", async ({ jwt, paymentOrderId, reason }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      "/api/payments/fail",
      { paymentOrderId, reason },
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) return rejectWithValue(error.response.data?.message || "Failed to mark payment failed");
    return rejectWithValue("Failed to mark payment failed");
  }
});

// Legacy redirect callback support (payment links)
export const paymentSuccess = createAsyncThunk<
  ApiResponse,
  { paymentId: string; jwt: string; paymentLinkId: string },
  { rejectValue: string }
>("orders/paymentSuccess", async ({ paymentId, jwt, paymentLinkId }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { paymentLinkId },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) return rejectWithValue(error.response.data?.message || "Payment verification failed");
    return rejectWithValue("Failed to process payment");
  }
});

export const cancelOrder = createAsyncThunk<Order, { orderId: number; jwt: string }>(
  "orders/cancelOrder",
  async ({ orderId, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${jwt}` },
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
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<CheckoutInitPayload>) => {
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

      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentConfirmed = false;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state) => {
        state.loading = false;
        state.paymentConfirmed = true;
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.paymentConfirmed = false;
        state.error = action.payload as string;
      })

      .addCase(markPaymentFailed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markPaymentFailed.fulfilled, (state) => {
        state.loading = false;
        state.paymentConfirmed = false;
      })
      .addCase(markPaymentFailed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(paymentSuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentConfirmed = false;
      })
      .addCase(paymentSuccess.fulfilled, (state) => {
        state.loading = false;
        state.paymentConfirmed = true;
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
        state.orders = state.orders.map((order) =>
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

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) => state.orders.currentOrder;
export const selectPaymentOrder = (state: RootState) => state.orders.paymentOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectPaymentConfirmed = (state: RootState) => state.orders.paymentConfirmed;
