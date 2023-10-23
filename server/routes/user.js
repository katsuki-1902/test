const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { UserSchema } = require("./schema");

const User = mongoose.model("User", UserSchema);

router.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, phone, address, email, password } = req.body;
    const user = new User({
      firstName,
      lastName,
      phone,
      address,
      email,
      password,
      role: "USER",
      isActive: true,
    });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
      password,
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all users

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, address, email, password, role, isActive } = req.body;
    const user = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        firstName,
        lastName,
        phone,
        address,
        email,
        password,
        role,
        isActive,
      },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
