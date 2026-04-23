const jwt = require("jsonwebtoken");
require("dotenv").config();

// ================= GET TOKEN =================
const getTokenFromRequest = (req) => {
  const cookieToken = req.cookies?.access_token;

  const authHeader = req.headers.authorization;

  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  return cookieToken || bearerToken || null;
};

// ================= VERIFY TOKEN =================
const verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // ⚠️ FIX: phải là ACCESS_TOKEN_SECRET (không phải ACCESS_TOKEN)
};

// ================= HANDLE ERROR =================
const handleAuthError = (err, res) => {
  console.error("JWT ERROR:", err.message);

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
    return next();
  } catch (err) {
    return handleAuthError(err, res);
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

    // ⚠️ FIX: an toàn hơn check role
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        status: "ERR",
        code: "NOT_ADMIN",
        message: "Admin only",
      });
    }

    req.user = user;
    return next();
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

    if (user?.role === "admin" || String(user?.id) === String(userId)) {
      req.user = user;
      return next();
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
