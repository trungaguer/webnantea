import axios from "axios";
import { axiosJWT } from "./UserService"; // dùng instance có token

const API_URL = process.env.REACT_APP_API_URL;

// ================= CREATE PRODUCT =================
export const createProduct = async (data, access_token) => {
  const res = await axiosJWT.post(`${API_URL}/product/create`, data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

// ================= GET ALL PRODUCT =================
export const getAllProduct = async (limit, page) => {
  const res = await axios.get(
    `${API_URL}/product/get-all?limit=${limit || ""}&page=${page || ""}`,
  );
  return res.data;
};

// ================= GET DETAILS PRODUCT =================
export const getDetailsProduct = async (id) => {
  const res = await axios.get(`${API_URL}/product/get-details/${id}`);
  return res.data;
};

// ================= UPDATE PRODUCT =================
export const updateProduct = async (id, data, access_token) => {
  const res = await axiosJWT.put(`${API_URL}/product/update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

// ================= DELETE PRODUCT =================
export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(`${API_URL}/product/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

// ================= SEARCH PRODUCT =================
export const searchProduct = async (keyword) => {
  const res = await axios.get(`${API_URL}/product/search?name=${keyword}`);
  return res.data;
};
