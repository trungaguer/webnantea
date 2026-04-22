const OrderService = require("../services/OrderService");
const PaymentService = require("../services/PaymentService");
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

const {
  sendOrderSuccessEmail,
  sendOrderCancelEmail,
} = require("../services/emailService");

// ================= CREATE ORDER =================
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, user } = req.body;

    console.log("📦 BODY:", req.body);
    console.log("👤 USER FROM REQ:", user);
    console.log("🔎 TYPE OF USER:", typeof user);

    if (!orderItems?.length || !shippingAddress || !paymentMethod || !user) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing required fields",
      });
    }

    const order = await OrderService.createOrder(req.body);

    console.log("✅ ORDER CREATED:", order?._id);

    const userId = typeof user === "object" ? user._id : user;

    const userInfo = await User.findById(userId);

    console.log("📧 USER EMAIL:", userInfo?.email);

    // ================= EMAIL =================
    if (userInfo?.email) {
      const safeOrder = {
        _id: order._id,
        orderItems: order.orderItems || [],
        totalPrice: order.totalPrice || 0,
      };

      try {
        await sendOrderSuccessEmail(userInfo.email, safeOrder);
        console.log("📧 EMAIL SENT SUCCESS");
      } catch (err) {
        console.error("❌ EMAIL ERROR:", err);
      }
    }

    // ================= CASH =================
    if (paymentMethod === "cash") {
      return res.status(201).json({
        status: "OK",
        type: "cash",
        data: order,
      });
    }

    // ================= BANKING =================
    if (paymentMethod === "banking") {
      const paymentUrl = await PaymentService.createPaymentUrl(order._id);

      return res.status(201).json({
        status: "OK",
        type: "banking",
        data: order,
        paymentUrl,
      });
    }

    return res.status(201).json({
      status: "OK",
      data: order,
    });
  } catch (e) {
    console.error("❌ CREATE ORDER ERROR:", e);
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// ================= GET MY ORDERS =================
const getMyOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    const data = await OrderService.getOrderByUser(userId);

    return res.status(200).json({
      status: "OK",
      data,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// ================= GET ALL (ADMIN) =================
const getAllOrders = async (req, res) => {
  try {
    const data = await OrderService.getAllOrders();

    return res.status(200).json({
      status: "OK",
      data,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// ================= UPDATE ORDER (ADMIN) =================
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(404).json({
        status: "ERR",
        message: "Order not found",
      });
    }

    if (["DELIVERED", "CANCELLED"].includes(order.status)) {
      return res.status(400).json({
        status: "ERR",
        message: "Order already finalized",
      });
    }

    const validTransitions = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["SHIPPING"],
      SHIPPING: ["DELIVERED"],
    };

    if (
      validTransitions[order.status] &&
      !validTransitions[order.status].includes(status)
    ) {
      return res.status(400).json({
        status: "ERR",
        message: `Invalid status from ${order.status} → ${status}`,
      });
    }

    // ================= TRỪ STOCK =================
    if (status === "CONFIRMED" && order.status === "PENDING") {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);

        if (!product || product.countInStock < item.amount) {
          return res.status(400).json({
            status: "ERR",
            message: `Product ${item.name} out of stock`,
          });
        }

        product.countInStock -= item.amount;
        await product.save();
      }
    }

    // ================= UPDATE STATUS =================
    order.status = status;

    // 🔥 THÊM LOGIC Ở ĐÂY

    if (status === "DELIVERED" && order.paymentMethod === "cash") {
      order.isDelivered = true;
      order.isPaid = true;
      order.paidAt = new Date();

      // 🔥 ADD: tăng số lượng đã bán
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.selled += item.amount;
          await product.save();
        }
      }

      if (order.user?.email) {
        try {
          await sendOrderSuccessEmail(order.user.email, order);
        } catch (err) {
          console.log("EMAIL DELIVERED ERROR:", err.message);
        }
      }
    }

    if (status === "CANCELLED") {
      order.isCancelled = true;

      if (order.user?.email) {
        try {
          await sendOrderCancelEmail(order.user.email, order);
        } catch (err) {
          console.log("EMAIL CANCEL ERROR:", err.message);
        }
      }
    }

    await order.save();

    return res.status(200).json({
      status: "OK",
      data: order,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// ================= CANCEL ORDER (USER) =================
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "ERR",
        message: "Order not found",
      });
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({
        status: "ERR",
        message: "Only pending order can be cancelled",
      });
    }

    // ================= HOÀN STOCK =================
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.amount;
        await product.save();
      }
    }

    order.status = "CANCELLED";
    await order.save();

    return res.status(200).json({
      status: "OK",
      data: order,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// ================= DELETE ORDER =================
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "ERR",
        message: "Order not found",
      });
    }

    if (order.isPaid || order.status !== "PENDING") {
      return res.status(400).json({
        status: "ERR",
        message: "Cannot delete processed order",
      });
    }

    await Order.findByIdAndDelete(orderId);

    return res.status(200).json({
      status: "OK",
      message: "Delete order success",
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// ================= PAYMENT SUCCESS =================
const paymentSuccess = async (req, res) => {
  try {
    const { orderId } = req.query;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "ERR",
        message: "Order not found",
      });
    }

    order.isPaid = true;
    order.paidAt = new Date();

    // 👉 auto confirm nếu banking
    if (order.status === "PENDING") {
      order.status = "CONFIRMED";
    }

    await order.save();

    return res.status(200).json({
      status: "OK",
      data: order,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};
// ================= REVENUE =================

// 🔥 TOTAL
const getRevenue = async (req, res) => {
  try {
    const data = await OrderService.getTotalRevenue();

    return res.status(200).json({
      status: "OK",
      data,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// 🔥 MONTH
const getRevenueByMonth = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    const data = await OrderService.getRevenueByMonth(year);

    return res.status(200).json({
      status: "OK",
      data,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// 🔥 DAY
const getRevenueByDay = async (req, res) => {
  try {
    const data = await OrderService.getRevenueByDay();

    return res.status(200).json({
      status: "OK",
      data,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};
// 🔥 PRODUCT SOLD BY DAY
const getProductDay = async (req, res) => {
  try {
    const data = await OrderService.getProductSoldByDay();

    return res.status(200).json({
      status: "OK",
      data,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};
module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrder,
  cancelOrder,
  deleteOrder,
  paymentSuccess,
  getRevenue,
  getRevenueByMonth,
  getRevenueByDay,
  getProductDay,
};
