const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Place order (authenticated, customer only)
router.post("/place", authMiddleware, async (req, res) => {
  try {
    const { customerName, address, phoneNumber, paymentMethod, items, totalPrice } = req.body;
    
    if (!customerName || !address || !phoneNumber || !items || items.length === 0) {
      return res.status(400).json({ error: "Please fill in all shipping details." });
    }

    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item._id || item.id);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.name} not found.` });
      }

      if (product.inventory < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.inventory}` });
      }

      // Deduct inventory
      product.inventory -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity || 1,
        farmerId: product.farmer
      });
    }

    const newOrder = new Order({
      buyer: req.user.id,
      customerName,
      address,
      phoneNumber,
      paymentMethod: paymentMethod || "Cash On Delivery",
      items: orderItems,
      totalPrice: totalPrice
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order Placed Successfully",
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders (role based)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let orders;
    if (req.user.role === "admin") {
      orders = await Order.find()
        .populate("buyer", "name email")
        .populate("items.product")
        .sort({ createdAt: -1 });
    } else if (req.user.role === "farmer") {
      orders = await Order.find({
        "items.farmerId": req.user.id
      })
        .populate("buyer", "name email")
        .populate("items.product")
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ buyer: req.user.id })
        .populate("items.product")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (Farmer/Admin only)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "farmer" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only farmers or admins can update order statuses." });
    }

    const { status } = req.body;
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (req.user.role === "farmer") {
      const hasItem = order.items.some(item => item.farmerId.toString() === req.user.id);
      if (!hasItem) {
        return res.status(403).json({ error: "Access denied. You do not own any products in this order." });
      }
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;