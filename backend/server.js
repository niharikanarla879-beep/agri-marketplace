const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://agri-marketplace-frontend-1.onrender.com",
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

app.use("/api/orders", orderRoutes);

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