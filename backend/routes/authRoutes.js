const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log(req.body);

  try {
    const { name, email, password, role} = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });

    }
    const hashedPassword = await bcrypt.hash(password, 10);
const user = new User({
  name,
  email,
  password: hashedPassword,
  role,
});

await user.save();

res.status(201).json({
  message: "User registered successfully",
});
  } catch (error) {
    console.log(error);

    res.status(500).json({
        error: error.message,
    });
  }
 });
  

    router.post("/login", async (req, res) => {
      try {
        const email = req.body.email.trim();
        const password = req.body.password;

       const user = await User.findOne({ email });

         if (!user) {
         return res.status(400).json({
           message: "User not found",
        });
      }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      "secretkey",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;