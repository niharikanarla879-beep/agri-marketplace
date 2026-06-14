const mongoose = require("mongoose");
const mockDb = require("./mockDb");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "farmer", "admin"],
    default: "customer",
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }]
}, {
  timestamps: true
});

const RealUser = mongoose.model("User", userSchema);

module.exports = new Proxy(RealUser, {
  construct(target, args) {
    if (mongoose.connection.readyState !== 1) {
      return new mockDb.MockUser(...args);
    }
    return new target(...args);
  },
  get(target, prop) {
    if (mongoose.connection.readyState !== 1) {
      return mockDb.MockUser[prop];
    }
    return target[prop];
  }
});