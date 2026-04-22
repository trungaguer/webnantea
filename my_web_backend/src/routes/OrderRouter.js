const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/OrderController");
const {
  authUserMiddleware,
  authAdminMiddleware,
} = require("../middleware/authMiddleware");

// ================= USER =================

// tạo order (cash + banking)
router.post("/create", authUserMiddleware, OrderController.createOrder);

// lấy đơn của user
router.get("/my-orders/:id", authUserMiddleware, OrderController.getMyOrders);

// huỷ đơn
router.put("/cancel/:id", authUserMiddleware, OrderController.cancelOrder);

// ================= PAYMENT =================

// 🔥 callback sau khi thanh toán (banking)
router.get("/payment-success", OrderController.paymentSuccess);

// ================= ADMIN =================

// lấy tất cả đơn
router.get("/all", authAdminMiddleware, OrderController.getAllOrders);

// update trạng thái
router.put("/update/:id", authAdminMiddleware, OrderController.updateOrder);
// ================= TEST MAIL =================
router.get("/test-mail", async (req, res) => {
  try {
    console.log("🚀 TEST MAIL ROUTE");

    await sendOrderSuccessEmail("EMAIL_CUA_BAN@gmail.com", {
      _id: "TEST123",
      orderItems: [{ name: "Test Product", amount: 1, price: 100000 }],
      totalPrice: 100000,
    });

    res.send("✅ SEND MAIL SUCCESS");
  } catch (error) {
    console.log("❌ EMAIL FAILED FULL:");
    console.log(error);
    console.log("❌ ERROR MESSAGE:", error.message);
    console.log("❌ ERROR CODE:", error.code);
    console.log("❌ RESPONSE:", error.response);
  }
});
// ================= REVENUE =================

// tổng doanh thu
router.get("/revenue", authAdminMiddleware, OrderController.getRevenue);

// theo tháng
router.get(
  "/revenue/month",
  authAdminMiddleware,
  OrderController.getRevenueByMonth,
);

// theo ngày
router.get(
  "/revenue/day",
  authAdminMiddleware,
  OrderController.getRevenueByDay,
);
// sản phẩm bán theo ngày
router.get("/product/day", authAdminMiddleware, OrderController.getProductDay);
module.exports = router;
