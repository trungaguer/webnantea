import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================= AXIOS CONFIG =================
const API = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/order`
  : "http://localhost:3001/api/order";

// helper lấy token
const getToken = () => localStorage.getItem("access_token");

// helper lấy userId
const getUserId = () => localStorage.getItem("user_id");

// ================= FETCH ORDERS =================
export const fetchOrdersAsync = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      const token = getToken();

      if (!token) throw new Error("Missing access token");
      if (!userId) throw new Error("Missing userId");

      const res = await axios.get(`${API}/my-orders/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ================= CANCEL ORDER =================
export const cancelOrderAsync = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) throw new Error("Missing access token");

      const res = await axios.put(
        `${API}/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ================= UPDATE ORDER =================
export const updateOrderAsync = createAsyncThunk(
  "order/updateOrder",
  async ({ orderId, data }, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) throw new Error("Missing access token");

      const res = await axios.put(`${API}/update/${orderId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ================= SLICE =================
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    isLoading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= FETCH =================
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        const data = action.payload;

        state.orders = data?.data || data?.orders || [];
      })

      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Fetch orders failed";
      })

      // ================= CANCEL =================
      .addCase(cancelOrderAsync.fulfilled, (state, action) => {
        const updated = action.payload?.data || action.payload;

        if (!updated?._id) return;

        const index = state.orders.findIndex((o) => o._id === updated._id);

        if (index !== -1) {
          state.orders[index] = updated;
        }
      })

      // ================= UPDATE =================
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        const updated = action.payload?.data || action.payload;

        if (!updated?._id) return;

        const index = state.orders.findIndex((o) => o._id === updated._id);

        if (index !== -1) {
          state.orders[index] = updated;
        }
      });
  },
});

export default orderSlice.reducer;
