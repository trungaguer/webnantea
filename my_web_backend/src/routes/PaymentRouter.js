const express = require("express");
const router = express.Router();

const PaymentController = require("../controllers/PaymentController");
const { authUserMiddleware } = require("../middleware/authMiddleware");

// ================= CREATE PAYMENT =================
router.post("/create", authUserMiddleware, PaymentController.createPayment);

// ================= CALLBACK =================
// 🔥 không cần auth (vì redirect từ FE hoặc cổng thanh toán)
router.get("/success", PaymentController.paymentSuccess);

// ================= CHECK STATUS =================
router.get(
  "/status/:orderId",
  authUserMiddleware,
  PaymentController.checkPayment,
);

module.exports = router;
