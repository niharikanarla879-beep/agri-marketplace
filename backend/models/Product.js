const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    default: "Fresh agricultural products direct from the farm."
  },
  category: {
    type: String,
    required: true,
    default: "Vegetables"
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  inventory: {
    type: Number,
    required: true,
    default: 100
  },
  reviews: [reviewSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model("Product", productSchema);
