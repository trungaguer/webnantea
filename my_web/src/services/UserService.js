import axios from "axios";

// ================= AXIOS INSTANCE =================
export const axiosJWT = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// ================= REQUEST INTERCEPTOR =================
axiosJWT.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ================= RESPONSE INTERCEPTOR =================
let isRefreshing = false;
let failedQueue = [];

// xử lý queue
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosJWT.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error?.response?.status;

    // 🔥 FIX QUAN TRỌNG: không phụ thuộc code nữa
    if (status === 401 && !originalRequest._retry) {
      // tránh loop vô hạn
      if (originalRequest.url?.includes("/user/refresh-token")) {
        return Promise.reject(error);
      }

      // nếu đang refresh → đưa request vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosJWT(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🔥 gọi refresh token (dùng cookie)
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data?.access_token;

        if (!newAccessToken) {
          throw new Error("No access token returned");
        }

        // lưu token mới
        localStorage.setItem("access_token", newAccessToken);

        // set default header
        axiosJWT.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        // xử lý queue
        processQueue(null, newAccessToken);

        // retry request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosJWT(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // logout sạch
        localStorage.clear();
        delete axiosJWT.defaults.headers.common.Authorization;

        window.location.href = "/sign-in";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ================= API =================

// LOGIN
export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-in`,
    data,
    { withCredentials: true },
  );

  if (res.data?.access_token) {
    localStorage.setItem("access_token", res.data.access_token);
  }

  return res.data;
};

// SIGNUP
export const signupUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-up`,
    data,
  );
  return res.data;
};

// GET DETAILS
export const getDetailsUser = async (id) => {
  const res = await axiosJWT.get(`/user/get-details/${id}`);
  return res.data;
};

// DELETE USER
export const deleteUser = async (id) => {
  const res = await axiosJWT.delete(`/user/delete-user/${id}`);
  return res.data;
};

// GET ALL USER
export const getAllUser = async () => {
  const res = await axiosJWT.get(`/user/getAll`);
  return res.data;
};

// LOGOUT
export const logoutUser = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/log-out`,
    {},
    { withCredentials: true },
  );

  localStorage.clear();
  delete axiosJWT.defaults.headers.common.Authorization;

  return res.data;
};

// UPDATE USER
export const updateUser = async (id, data) => {
  const res = await axiosJWT.put(`/user/update-user/${id}`, data);
  return res.data;
};

// DELETE MANY
export const deleteManyUser = async (data) => {
  const res = await axiosJWT.post(`/user/delete-many`, data);
  return res.data;
};
