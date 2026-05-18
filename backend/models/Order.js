const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: String,
  products: Array,
  totalPrice: Number,
  address: String,
}, {
  timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);