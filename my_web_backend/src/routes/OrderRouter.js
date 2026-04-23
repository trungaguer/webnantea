const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/OrderController");

const {
  authUserMiddleware,
  authAdminMiddleware,
} = require("../middleware/authMiddleware");

// ================= USER =================
router.post("/create", authUserMiddleware, OrderController.createOrder);

router.get("/my-orders/:id", authUserMiddleware, OrderController.getMyOrders);

router.put("/cancel/:id", authUserMiddleware, OrderController.cancelOrder);

// ================= PAYMENT =================
router.get("/payment-success", OrderController.paymentSuccess);

// ================= ADMIN =================
router.get("/all", authAdminMiddleware, OrderController.getAllOrders);

router.put("/update/:id", authAdminMiddleware, OrderController.updateOrder);

// 🔥 ADD MISSING ROUTES (FE đang dùng)
router.delete("/delete/:id", authUserMiddleware, OrderController.deleteOrder);

router.put("/edit/:id", authUserMiddleware, OrderController.updateOrder);

// ================= REVENUE (ADMIN ONLY) =================
router.get("/revenue", authAdminMiddleware, OrderController.getRevenue);

router.get(
  "/revenue/month",
  authAdminMiddleware,
  OrderController.getRevenueByMonth,
);

router.get(
  "/revenue/day",
  authAdminMiddleware,
  OrderController.getRevenueByDay,
);

router.get("/product/day", authAdminMiddleware, OrderController.getProductDay);

// ================= TEST MAIL =================
const { sendOrderSuccessEmail } = require("../services/emailService");

router.get("/test-mail", async (req, res) => {
  try {
    await sendOrderSuccessEmail("test@gmail.com", {
      _id: "TEST123",
      orderItems: [{ name: "Test Product", amount: 1, price: 100000 }],
      totalPrice: 100000,
    });

    res.send("SEND MAIL SUCCESS");
  } catch (error) {
    console.log(error);
    res.status(500).send("MAIL ERROR");
  }
});

module.exports = router;
