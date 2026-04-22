import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// ================= CREATE PAYMENT =================
export const createPayment = async (orderId, access_token) => {
  const res = await axios.post(
    `${API_URL}/payment/create`,
    { orderId },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );
  return res.data;
};

// ================= PAYMENT SUCCESS =================
export const paymentSuccess = async (orderId) => {
  const res = await axios.get(`${API_URL}/payment/success?orderId=${orderId}`);
  return res.data;
};

// ================= CHECK STATUS =================
export const checkPaymentStatus = async (orderId, access_token) => {
  const res = await axios.get(`${API_URL}/payment/status/${orderId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};
