const express = require("express");
const Product = require("../models/Product");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all products (with search, category, sort, farmer-filter, and pagination)
router.get("/", async (req, res) => {
  try {
    const { search, category, farmer, sort, page = 1, limit = 12 } = req.query;
    
    let query = {};

    // Search filter
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Farmer filter
    if (farmer) {
      query.farmer = farmer;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let productsQuery = Product.find(query).populate("farmer", "name email");
    
    if (sort === "price-asc") {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === "price-desc") {
      productsQuery = productsQuery.sort({ price: -1 });
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const total = await Product.countDocuments(query);
    const products = await productsQuery.skip(skip).limit(limitNum);

    // If sorting by rating-desc, sort in memory
    let finalProducts = products;
    if (sort === "rating-desc") {
      const getAvg = (p) => p.reviews.length ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length : 0;
      const allProductsForQuery = await Product.find(query).populate("farmer", "name email");
      allProductsForQuery.sort((a, b) => getAvg(b) - getAvg(a));
      finalProducts = allProductsForQuery.slice(skip, skip + limitNum);
    }

    res.json({
      products: finalProducts,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("farmer", "name email")
      .populate("reviews.user", "name");
      
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Product (Farmer only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "farmer" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only farmers can add products." });
    }

    const { name, price, image, description, category, inventory } = req.body;
    if (!name || !price || !image || !category) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    const cleanedPrice = parseFloat(price.toString().replace("₹", "").trim());

    const product = new Product({
      name,
      price: cleanedPrice,
      image,
      description: description || "Fresh agricultural products direct from the farm.",
      category,
      inventory: parseInt(inventory) || 100,
      farmer: req.user.id
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit Product (Farmer/Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.farmer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. You do not own this product." });
    }

    const { name, price, image, description, category, inventory } = req.body;
    
    if (name) product.name = name;
    if (price !== undefined) product.price = parseFloat(price.toString().replace("₹", "").trim());
    if (image) product.image = image;
    if (description) product.description = description;
    if (category) product.category = category;
    if (inventory !== undefined) product.inventory = parseInt(inventory) || 0;

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Product (Farmer/Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.farmer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. You do not own this product." });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Review (Buyer only)
router.post("/:id/review", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: "Please provide rating and review comment" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id
    );
    if (alreadyReviewed) {
      return res.status(400).json({ error: "You have already reviewed this product" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const review = {
      user: req.user.id,
      name: user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    await product.save();
    res.status(201).json({ message: "Review added successfully", reviews: product.reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Wishlist toggle endpoint
router.post("/:id/wishlist", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const index = user.wishlist.indexOf(product._id);
    let isWishlisted = false;
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(product._id);
      isWishlisted = true;
    }

    await user.save();
    res.json({ message: isWishlisted ? "Added to wishlist" : "Removed from wishlist", isWishlisted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;