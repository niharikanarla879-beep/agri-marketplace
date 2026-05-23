const express = require("express");

const router = express.Router();

const products = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    price: 40,
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1000&auto=format&fit=crop",
  },

  {
    id: 2,
    name: "Organic Carrots",
    price: 30,
    image:
      "https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=1000&auto=format&fit=crop",
  },

  {
    id: 3,
    name: "Green Chillies",
    price: 25,
    image:
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=1000&auto=format&fit=crop",
  },
];

router.get("/", (req, res) => {
  res.json(products);
});

module.exports = router;