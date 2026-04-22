// services/OrderService.js
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api/order";

// ================= EXISTING (GIỮ NGUYÊN) =================

export const createOrder = async (data, access_token) => {
  const payload = {
    ...data,
    user: data.user?._id || data.user,
  };

  const res = await axios.post(`${API_URL}/create`, payload, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

export const getOrderByUser = async (id, access_token) => {
  const res = await axios.get(`${API_URL}/get-order/${id}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.data;
};

export const getDetailOrder = async (id, access_token) => {
  const res = await axios.get(`${API_URL}/details/${id}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.data;
};

export const payOrder = async (id, access_token) => {
  const res = await axios.put(
    `${API_URL}/pay/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${access_token}` },
    },
  );
  return res.data;
};

// =====================================================
// ================= NEW FEATURES (ADD ONLY) ============
// =====================================================

// 🔥 CANCEL ORDER
export const cancelOrder = async (id, access_token) => {
  const res = await axios.put(
    `${API_URL}/cancel/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${access_token}` },
    },
  );
  return res.data;
};

// 🔥 DELETE ORDER
export const deleteOrder = async (id, access_token) => {
  const res = await axios.delete(`${API_URL}/delete/${id}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.data;
};

// 🔥 EDIT ORDER
export const editOrder = async (id, data, access_token) => {
  const res = await axios.put(`${API_URL}/edit/${id}`, data, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.data;
};

// =====================================================
// ================= ADMIN (THIẾU → THÊM) ===============
// =====================================================

// 🔥 GET ALL ORDERS (ADMIN)
export const getAllOrders = async (access_token) => {
  const res = await axios.get(`${API_URL}/order/all`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.data;
};

// 🔥 UPDATE ORDER STATUS (ADMIN)
export const updateOrder = async (id, data, access_token) => {
  const res = await axios.put(`${API_URL}/order/update/${id}`, data, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.data;
};
