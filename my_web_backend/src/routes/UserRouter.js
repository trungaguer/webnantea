const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");

const {
  authUserMiddleware,
  authAdminMiddleware,
  authOwnerMiddleware,
} = require("../middleware/authMiddleware");

// ================= AUTH =================

// đăng ký
router.post("/sign-up", UserController.createUser);

// đăng nhập
router.post("/sign-in", UserController.loginUser);

// logout
router.post("/log-out", UserController.logoutUser);

// refresh token
router.post("/refresh-token", UserController.refreshToken);

// ================= USER =================

// user tự update hoặc admin
router.put("/update-user/:id", authOwnerMiddleware, UserController.updateUser);

// user tự xem hoặc admin
router.get(
  "/get-details/:id",
  authOwnerMiddleware,
  UserController.getDetailsUser,
);

// ================= ADMIN =================

// admin xoá user
router.delete(
  "/delete-user/:id",
  authAdminMiddleware,
  UserController.deleteUser,
);

// admin lấy tất cả user
router.get("/getAll", authAdminMiddleware, UserController.getAllUser);

module.exports = router;
