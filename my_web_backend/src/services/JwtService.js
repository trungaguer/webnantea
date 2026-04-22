const jwt = require("jsonwebtoken");
require("dotenv").config();

//  ACCESS TOKEN (short-lived)
const genneralAccessToken = async (payload) => {
  return jwt.sign(
    {
      ...payload,
      tokenType: "access", // giữ token type
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "15m", // tăng thời gian để tránh 401 nhanh
    },
  );
};

//  REFRESH TOKEN (long-lived)
const genneralRefreshToken = async (payload) => {
  return jwt.sign(
    {
      ...payload,
      tokenType: "refresh", //  giữ token type
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    },
  );
};

//  REFRESH TOKEN SERVICE
const refreshTokenJwtService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          console.log("Refresh token verify error:", err); // 🔹 log để debug
          // 🔥 phân loại lỗi rõ ràng
          if (err.name === "TokenExpiredError") {
            return resolve({
              status: "ERR",
              message: "Refresh token expired",
            });
          }

          return resolve({
            status: "ERR",
            message: "Invalid refresh token",
          });
        }

        //  check loại token
        if (user.tokenType !== "refresh") {
          return resolve({
            status: "ERR",
            message: "Invalid token type",
          });
        }

        // tạo access token mới
        const access_token = await genneralAccessToken({
          id: user.id,
          isAdmin: user.isAdmin,
        });

        console.log("New access token generated for user:", user.id);

        return resolve({
          status: "OK",
          access_token,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshTokenJwtService,
};
