const jwt = require("jsonwebtoken");
require("dotenv").config();

// ================= GET TOKEN =================
const getTokenFromRequest = (req) => {
  if (req.cookies?.access_token) {
    return req.cookies.access_token;
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

// ================= VERIFY TOKEN =================
const verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN);
};

// ================= HANDLE ERROR =================
const handleAuthError = (err, res) => {
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "ERR",
      code: "TOKEN_EXPIRED",
      message: "Token expired",
    });
  }

  return res.status(401).json({
    status: "ERR",
    code: "INVALID_TOKEN",
    message: "Invalid token",
  });
};

// ================= AUTH USER =================
const authUserMiddleware = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        status: "ERR",
        code: "NO_TOKEN",
        message: "Token is required",
      });
    }

    const user = verifyToken(token);

    req.user = user;
    return next(); // ✅ FIX: luôn return next()
  } catch (err) {
    return handleAuthError(err, res); // giữ nguyên, không cần next ở đây
  }
};

// ================= AUTH ADMIN =================
const authAdminMiddleware = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        status: "ERR",
        code: "NO_TOKEN",
        message: "Token is required",
      });
    }

    const user = verifyToken(token);

    if (!user?.isAdmin) {
      return res.status(403).json({
        status: "ERR",
        code: "NOT_ADMIN",
        message: "Admin only",
      });
    }

    req.user = user;
    return next(); // ✅ FIX
  } catch (err) {
    return handleAuthError(err, res);
  }
};

// ================= AUTH OWNER =================
const authOwnerMiddleware = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        status: "ERR",
        code: "NO_TOKEN",
        message: "Token is required",
      });
    }

    const user = verifyToken(token);

    const userId = req.params.id;

    if (user?.isAdmin || String(user?.id) === String(userId)) {
      req.user = user;
      return next(); // ✅ đã đúng, giữ nguyên
    }

    return res.status(403).json({
      status: "ERR",
      code: "FORBIDDEN",
      message: "You are not allowed to access this resource",
    });
  } catch (err) {
    return handleAuthError(err, res);
  }
};

module.exports = {
  authUserMiddleware,
  authAdminMiddleware,
  authOwnerMiddleware,
};
