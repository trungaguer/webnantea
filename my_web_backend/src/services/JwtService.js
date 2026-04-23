const jwt = require("jsonwebtoken");
require("dotenv").config();

// ================= ACCESS TOKEN =================
const genneralAccessToken = (payload) => {
  return jwt.sign(
    {
      ...payload,
      tokenType: "access",
    },
    process.env.ACCESS_TOKEN, // ✔ giữ nguyên theo env bạn
    {
      expiresIn: "15m",
    },
  );
};

// ================= REFRESH TOKEN =================
const genneralRefreshToken = (payload) => {
  return jwt.sign(
    {
      ...payload,
      tokenType: "refresh",
    },
    process.env.REFRESH_TOKEN, // ✔ giữ nguyên theo env bạn
    {
      expiresIn: "7d",
    },
  );
};

// ================= REFRESH TOKEN SERVICE =================
const refreshTokenJwtService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(
        token,
        process.env.REFRESH_TOKEN, // ✔ đúng env của bạn
        async (err, decoded) => {
          if (err) {
            console.log("Refresh token error:", err);

            return resolve({
              status: "ERR",
              message:
                err.name === "TokenExpiredError"
                  ? "Refresh token expired"
                  : "Invalid refresh token",
            });
          }

          // check token type
          if (!decoded || decoded.tokenType !== "refresh") {
            return resolve({
              status: "ERR",
              message: "Invalid token type",
            });
          }

          // ================= FIX CHÍNH =================
          const access_token = genneralAccessToken({
            id: decoded.id, // ✔ FIX QUAN TRỌNG
            isAdmin: decoded.isAdmin,
          });

          console.log("New access token generated for user:", decoded.id);

          return resolve({
            status: "OK",
            access_token,
          });
        },
      );
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
