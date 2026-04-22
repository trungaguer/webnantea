const mongoose = require("mongoose");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

// ================= CREATE ORDER =================
const createOrder = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderItems, shippingAddress, paymentMethod, shippingPrice, user } =
      data;

    if (!orderItems?.length) throw new Error("Order items required");
    if (!user) throw new Error("User is required");

    let itemsPrice = 0;
    const normalizedItems = [];

    for (const item of orderItems) {
      const productId =
        typeof item.product === "string" ? item.product : item.product?._id;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error(`Invalid productId: ${productId}`);
      }

      const product = await Product.findById(productId).session(session);
      if (!product) throw new Error("Product not found");

      const finalPrice = product.price * (1 - (product.discount || 0) / 100);

      itemsPrice += finalPrice * item.amount;

      normalizedItems.push({
        product: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        discount: product.discount || 0,
        amount: item.amount,
      });
    }

    const totalPrice = itemsPrice + (shippingPrice || 0);

    // ✅ đồng bộ status
    const status = "PENDING";

    const order = await Order.create(
      [
        {
          orderItems: normalizedItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user,
          status,
          isPaid: false,
          paidAt: null,
          isDelivered: false,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return order[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// ================= GET USER ORDERS =================
const getOrderByUser = async (userId) => {
  return await Order.find({ user: userId })
    .populate("orderItems.product")
    .sort({ createdAt: -1 });
};

// ================= GET ALL =================
const getAllOrders = async () => {
  return await Order.find()
    .populate("user", "name email")
    .populate("orderItems.product")
    .sort({ createdAt: -1 });
};

// ================= UPDATE STATUS (ADMIN) =================
const updateOrderStatus = async (orderId, data) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  const allowedStatus = [
    "PENDING",
    "CONFIRMED",
    "SHIPPING",
    "DELIVERED",
    "CANCELLED",
  ];

  if (data.status && !allowedStatus.includes(data.status)) {
    throw new Error("Invalid status");
  }

  // 🔥 VALID FLOW
  const validTransitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPING"],
    SHIPPING: ["DELIVERED"],
  };

  if (
    data.status &&
    validTransitions[order.status] &&
    !validTransitions[order.status].includes(data.status)
  ) {
    throw new Error(`Invalid status from ${order.status} → ${data.status}`);
  }

  // ================= UPDATE STATUS =================
  if (data.status) {
    order.status = data.status;
  }

  // ================= PAYMENT =================
  if (data.isPaid === true) {
    order.isPaid = true;
    order.paidAt = new Date();

    if (order.status === "PENDING") {
      order.status = "CONFIRMED";
    }
  }

  // ================= DELIVERED =================
  if (data.isDelivered === true) {
    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = "DELIVERED";
  }

  return await order.save();
};

// ================= CANCEL ORDER =================
const cancelOrder = async (orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) throw new Error("Order not found");

    if (["DELIVERED", "CANCELLED"].includes(order.status)) {
      throw new Error("Order already finalized");
    }

    if (order.isPaid) {
      throw new Error("Cannot cancel paid order");
    }

    // ================= RESTORE STOCK =================
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product).session(session);

      if (product) {
        product.countInStock += item.amount;
        await product.save({ session });
      }
    }

    order.status = "CANCELLED";

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// ================= DELETE ORDER =================
const deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) throw new Error("Order not found");

  if (order.isPaid || order.status !== "PENDING") {
    throw new Error("Cannot delete processed order");
  }

  await Order.findByIdAndDelete(orderId);

  return true;
};

// ================= EDIT ORDER =================
const editOrder = async (orderId, data) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  if (order.isPaid) {
    throw new Error("Cannot edit paid order");
  }

  if (data.shippingAddress) {
    order.shippingAddress = data.shippingAddress;
  }

  if (data.shippingPrice !== undefined) {
    order.shippingPrice = data.shippingPrice;
  }

  return await order.save();
};

// ================= AUTO CANCEL BANKING EXPIRED =================
const cancelExpiredOrders = async () => {
  const now = new Date();

  const orders = await Order.find({
    paymentMethod: "banking",
    isPaid: false,
    expiredAt: { $lt: now },
    status: "PENDING",
  });

  for (const order of orders) {
    await cancelOrder(order._id);
  }

  return orders.length;
};
// ================= REVENUE =================

// 🔥 TOTAL REVENUE
const getTotalRevenue = async () => {
  const result = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        status: "DELIVERED",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { totalRevenue: 0, totalOrders: 0 };
};

// 🔥 REVENUE BY MONTH
const getRevenueByMonth = async (year) => {
  return await Order.aggregate([
    {
      $match: {
        isPaid: true,
        status: "DELIVERED",
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
};

// 🔥 REVENUE BY DAY
const getRevenueByDay = async () => {
  return await Order.aggregate([
    {
      $match: {
        isPaid: true,
        status: "DELIVERED",
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1,
      },
    },
  ]);
};
// 🔥 PRODUCT SOLD BY DAY
const getProductSoldByDay = async () => {
  return await Order.aggregate([
    {
      $match: {
        isPaid: true,
        status: "DELIVERED",
      },
    },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: {
          name: "$orderItems.name",
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalSold: { $sum: "$orderItems.amount" },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1,
      },
    },
  ]);
};
module.exports = {
  createOrder,
  getOrderByUser,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  editOrder,
  cancelExpiredOrders,
  getTotalRevenue,
  getRevenueByMonth,
  getRevenueByDay,
  getProductSoldByDay,
};
