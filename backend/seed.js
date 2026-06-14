const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI;

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log("DB Connected for Seeding");

    // 1. Create default Farmer
    let farmer = await User.findOne({ email: "farmer@agri.com" });
    if (!farmer) {
      const hashedFarmerPassword = await bcrypt.hash("farmer123", 10);
      farmer = new User({
        name: "Ramesh Kumar",
        email: "farmer@agri.com",
        password: hashedFarmerPassword,
        role: "farmer",
      });
      await farmer.save();
      console.log("Farmer seeded: farmer@agri.com / farmer123");
    }

    // 2. Create default Customer
    let buyer = await User.findOne({ email: "buyer@gmail.com" });
    if (!buyer) {
      const hashedBuyerPassword = await bcrypt.hash("buyer123", 10);
      buyer = new User({
        name: "Niharika N.",
        email: "buyer@gmail.com",
        password: hashedBuyerPassword,
        role: "customer",
      });
      await buyer.save();
      console.log("Customer seeded: buyer@gmail.com / buyer123");
    }

    // 3. Create default Admin
    let admin = await User.findOne({ email: "admin@agri.com" });
    if (!admin) {
      const hashedAdminPassword = await bcrypt.hash("admin123", 10);
      admin = new User({
        name: "Admin Moderator",
        email: "admin@agri.com",
        password: hashedAdminPassword,
        role: "admin",
      });
      await admin.save();
      console.log("Admin seeded: admin@agri.com / admin123");
    }

    // 4. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const products = [
        {
          name: "Fresh Red Tomatoes",
          price: 40,
          image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=600",
          description: "Harvested fresh daily from greenhouse fields. High-quality and rich in Lycopene.",
          category: "Vegetables",
          farmer: farmer._id,
          inventory: 200,
        },
        {
          name: "Organic Sweet Carrots",
          price: 50,
          image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=600",
          description: "Crunchy sweet carrots, completely chemical-free and grown in certified organic soil.",
          category: "Vegetables",
          farmer: farmer._id,
          inventory: 120,
        },
        {
          name: "Premium Wheat Grain Bag",
          price: 780,
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600",
          description: "Premium quality whole wheat grains, cleaned and packaged in a durable 25kg bag.",
          category: "Grains",
          farmer: farmer._id,
          inventory: 40,
        },
        {
          name: "Farm Fresh Milk",
          price: 65,
          image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600",
          description: "Raw pasteurized creamy cow milk, delivered fresh within hours of milking.",
          category: "Dairy",
          farmer: farmer._id,
          inventory: 80,
        },
        {
          name: "Organic Yellow Bananas",
          price: 60,
          image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=600",
          description: "Naturally ripened sweet bananas, free from chemical ripening agents.",
          category: "Fruits",
          farmer: farmer._id,
          inventory: 100,
        },
        {
          name: "High Grade NPK Fertilizer",
          price: 450,
          image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=600",
          description: "Balanced Nitrogen-Phosphorus-Potassium nutrients blend to optimize crops yields.",
          category: "Fertilizers",
          farmer: farmer._id,
          inventory: 50,
        }
      ];

      await Product.insertMany(products);
      console.log("Default catalog products seeded!");
    } else {
      console.log("Database catalog already contains products, skipping product seed.");
    }

    mongoose.disconnect();
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding error:", err);
    mongoose.disconnect();
  }
};

seedData();
