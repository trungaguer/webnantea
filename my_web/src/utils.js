import { jwtDecode } from "jwt-decode";

// ✅ check JSON
export const isJsonString = (data) => {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
};

// ✅ token
export const getAccessToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

// ✅ decode token
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Decode token error:", error);
    return null;
  }
};

// ✅ check token hết hạn
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// ✅ user local
export const getUserLocal = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// ✅ check login CHUẨN
export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;

  return !isTokenExpired(token);
};

// ✅ logout
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

// ✅ 👉 THÊM DUY NHẤT CÁI NÀY (fix lỗi của bạn)
export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};
