import axios from "axios";

// ================= AXIOS INSTANCE =================
export const axiosJWT = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// ================= REQUEST INTERCEPTOR =================
axiosJWT.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ================= RESPONSE INTERCEPTOR =================
let isRefreshing = false;
let failedQueue = [];

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

    // ================= FIX QUAN TRỌNG =================
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      if (originalRequest.url?.includes("/user/refresh-token")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${token}`,
              };

              resolve(axiosJWT.request(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // ================= REFRESH TOKEN =================
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newToken = res.data?.access_token;

        if (!newToken) {
          throw new Error("No access token returned");
        }

        localStorage.setItem("access_token", newToken);

        axiosJWT.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return axiosJWT.request(originalRequest);
      } catch (err) {
        processQueue(err, null);

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
  if (!id) {
    throw new Error("User ID is undefined");
  }

  const res = await axiosJWT.get(`/user/get-details/${id}`);

  return res.data;
};

// DELETE
export const deleteUser = async (id) => {
  const res = await axiosJWT.delete(`/user/delete-user/${id}`);

  return res.data;
};

// GET ALL
export const getAllUser = async () => {
  const res = await axiosJWT.get(`/user/getAll`);
  return res.data;
};

// UPDATE
export const updateUser = async (id, data) => {
  const res = await axiosJWT.put(`/user/update-user/${id}`, data);

  return res.data;
};

// DELETE MANY
export const deleteManyUser = async (data) => {
  const res = await axiosJWT.post(`/user/delete-many`, data);

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
