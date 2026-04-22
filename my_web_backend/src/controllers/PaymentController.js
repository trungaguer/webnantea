const PaymentService = require("../services/PaymentService");

// ================= CREATE PAYMENT =================
const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "OrderId is required",
      });
    }

    const paymentUrl = await PaymentService.createPaymentUrl(orderId);

    return res.status(200).json({
      status: "OK",
      paymentUrl,
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

    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "OrderId is required",
      });
    }

    const order = await PaymentService.updatePaymentStatus(orderId);

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

// ================= CHECK PAYMENT =================
const checkPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "OrderId is required",
      });
    }

    const data = await PaymentService.checkPaymentStatus(orderId);

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
  createPayment,
  paymentSuccess,
  checkPayment,
};
