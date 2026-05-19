const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/place", async (req, res) => {
  try {
    const newOrder = new Order(req.body);

    await newOrder.save();

    res.status(201).json({
      message: "Order Placed Successfully",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
router.get("/", async (req, res) => {

  try {

    const orders = await Order.find();

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});

module.exports = router;