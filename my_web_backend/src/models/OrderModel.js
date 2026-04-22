const mongoose = require("mongoose");

// ================= ORDER ITEM =================
const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { _id: false },
);

// ================= ORDER =================
const orderSchema = new mongoose.Schema(
  {
    orderItems: {
      type: [orderItemSchema],
      validate: [(arr) => arr.length > 0, "Order must have at least 1 item"],
    },

    // ================= SHIPPING =================
    shippingAddress: {
      fullName: { type: String, required: true, trim: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: {
        type: String,
        required: true,
        match: /^[0-9]{9,11}$/,
      },
      email: {
        type: String,
        required: true,
        match: /^\S+@\S+\.\S+$/,
      },
    },

    // ================= PAYMENT =================
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "banking"],
    },

    itemsPrice: { type: Number, required: true, min: 0 },
    shippingPrice: { type: Number, required: true, min: 0, default: 0 },
    totalPrice: { type: Number, required: true, min: 0 },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    // ================= DELIVERY =================
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },

    // ================= EXPIRE =================
    expiredAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

// ================= MIDDLEWARE =================

orderSchema.pre("save", function () {
  this.orderItems = this.orderItems.map((item) => {
    if (typeof item.product === "object") {
      item.product = item.product._id;
    }
    return item;
  });
});

//  AUTO CALCULATE PRICE (anti hack + đúng % discount)
orderSchema.pre("save", function () {
  if (!this.isModified("orderItems") && !this.isModified("shippingPrice"))
    return;

  const itemsTotal = this.orderItems.reduce((total, item) => {
    const finalPrice = item.price * (1 - item.discount / 100);
    return total + finalPrice * item.amount;
  }, 0);

  this.itemsPrice = itemsTotal;
  this.totalPrice = itemsTotal + this.shippingPrice;
});

//  AUTO UPPERCASE STATUS
orderSchema.pre("save", function () {
  if (this.status) {
    this.status = this.status.toUpperCase();
  }
});

// 🔥 AUTO SET EXPIRE (banking)
orderSchema.pre("save", function () {
  if (this.paymentMethod === "banking" && !this.expiredAt) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    this.expiredAt = now;
  }
});

// ================= INDEX =================
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ isPaid: 1, expiredAt: 1 });

// ================= EXPORT =================
module.exports = mongoose.model("Order", orderSchema);
