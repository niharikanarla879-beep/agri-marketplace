const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://agri-marketplace-two.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products" , productRoutes);


mongoose.connect(process.env.MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
})
.then(() => console.log("DB Connected"))
.catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});