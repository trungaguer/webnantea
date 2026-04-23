import axios from "axios";

// ================= BASE API =================
const API_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/order`
  : "http://localhost:3001/api/order";

// helper token
const getToken = () => localStorage.getItem("access_token");

// ================= CREATE ORDER =================
export const createOrder = async (data, access_token) => {
  const payload = {
    ...data,
    user: data.user?._id || data.user,
  };

  const res = await axios.post(`${API_URL}/create`, payload, {
    headers: {
      Authorization: `Bearer ${access_token || getToken()}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

// ================= GET USER ORDERS =================
export const getOrderByUser = async (id, access_token) => {
  const res = await axios.get(`${API_URL}/my-orders/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token || getToken()}`,
    },
  });

  return res.data;
};

// ================= GET DETAIL =================
export const getDetailOrder = async (id, access_token) => {
  const res = await axios.get(`${API_URL}/details/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token || getToken()}`,
    },
  });

  return res.data;
};

// ================= PAY ORDER =================
export const payOrder = async (id, access_token) => {
  const res = await axios.put(
    `${API_URL}/pay/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${access_token || getToken()}`,
      },
    },
  );

  return res.data;
};

// =====================================================
// ================= USER ACTIONS =======================
// =====================================================

// CANCEL ORDER
export const cancelOrder = async (id, access_token) => {
  const res = await axios.put(
    `${API_URL}/cancel/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${access_token || getToken()}`,
      },
    },
  );

  return res.data;
};

// DELETE ORDER
export const deleteOrder = async (id, access_token) => {
  const res = await axios.delete(`${API_URL}/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token || getToken()}`,
    },
  });

  return res.data;
};

// EDIT ORDER
export const editOrder = async (id, data, access_token) => {
  const res = await axios.put(`${API_URL}/edit/${id}`, data, {
    headers: {
      Authorization: `Bearer ${access_token || getToken()}`,
    },
  });

  return res.data;
};

// =====================================================
// ================= ADMIN =============================
// =====================================================

// GET ALL ORDERS (ADMIN)
export const getAllOrders = async (access_token) => {
  const res = await axios.get(`${API_URL}/all`, {
    headers: {
      Authorization: `Bearer ${access_token || getToken()}`,
    },
  });

  return res.data;
};

// UPDATE ORDER STATUS (ADMIN)
export const updateOrder = async (id, data, access_token) => {
  const res = await axios.put(`${API_URL}/update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${access_token || getToken()}`,
    },
  });

  return res.data;
};
