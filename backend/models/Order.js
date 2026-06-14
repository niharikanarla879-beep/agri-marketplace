const mongoose = require("mongoose");
const mockDb = require("./mockDb");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    default: "Cash On Delivery"
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  },
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const RealOrder = mongoose.model("Order", orderSchema);

module.exports = new Proxy(RealOrder, {
  construct(target, args) {
    if (mongoose.connection.readyState !== 1) {
      return new mockDb.MockOrder(...args);
    }
    return new target(...args);
  },
  get(target, prop) {
    if (mongoose.connection.readyState !== 1) {
      return mockDb.MockOrder[prop];
    }
    return target[prop];
  }
});