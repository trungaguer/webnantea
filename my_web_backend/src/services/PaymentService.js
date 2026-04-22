const Order = require("../models/OrderModel");

// ================= CREATE PAYMENT URL =================
const createPaymentUrl = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.isPaid) {
    throw new Error("Order already paid");
  }

  // 🔥 FAKE PAYMENT URL (FE sẽ redirect)
  const paymentUrl = `http://localhost:3000/payment?orderId=${orderId}`;

  return paymentUrl;
};

// ================= UPDATE PAYMENT STATUS =================
const updatePaymentStatus = async (orderId, data) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.isPaid) {
    return order;
  }

  // 🔥 update payment
  order.isPaid = true;
  order.paidAt = new Date();

  order.paymentResult = {
    id: data.transactionId || "FAKE_TXN_123",
    status: "success",
    update_time: new Date().toISOString(),
    email_address: data.email || order.shippingAddress.email,
  };

  // 🔥 update status
  if (order.status === "pending") {
    order.status = "confirmed";
  }

  await order.save();

  return order;
};

module.exports = {
  createPaymentUrl,
  updatePaymentStatus,
};
