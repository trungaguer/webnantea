import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================= AXIOS CONFIG =================
const API = "http://localhost:3001/api/order";

// helper lấy token
const getToken = () => localStorage.getItem("access_token");

// ================= FETCH ORDERS =================
export const fetchOrdersAsync = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("user_id");
      const token = getToken();

      if (!token) throw new Error("Missing access token");

      const url = userId ? `${API}/my-orders/${userId}` : `${API}/my-orders`;

      const res = await axios.get(url, {
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

// ================= UPDATE ORDER (REPLACE EDIT) =================
export const updateOrderAsync = createAsyncThunk(
  "order/updateOrder",
  async ({ orderId, data }, { rejectWithValue }) => {
    try {
      const token = getToken();

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

        state.orders = data?.data || data?.orders || data || [];
      })

      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Fetch orders failed";
      })

      // ================= CANCEL =================
      .addCase(cancelOrderAsync.fulfilled, (state, action) => {
        const updated = action.payload?.data || action.payload;

        const index = state.orders.findIndex((o) => o._id === updated._id);

        if (index !== -1) {
          state.orders[index] = updated;
        }
      })

      // ================= UPDATE =================
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        const updated = action.payload?.data || action.payload;

        const index = state.orders.findIndex((o) => o._id === updated._id);

        if (index !== -1) {
          state.orders[index] = updated;
        }
      });
  },
});

export default orderSlice.reducer;
