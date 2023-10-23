const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { CartSchema, OrderSchema, UserSchema } = require("./schema");

const Cart = mongoose.model("Cart", CartSchema);
const Order = mongoose.model("Order", OrderSchema);
const User = mongoose.model("User", UserSchema);

router.get("/orders", async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const orders = await Order.find({})
      .populate("products.product")
      .populate("user")
      .sort({ createdAt: -1 }) // 1 for ascending, -1 for descending
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/orders-count", async (req, res) => {
  try {
    const count = await Order.countDocuments({});
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.find({ user: id }).populate("products.product");
    if (!order) {
      return res.json({ products: [] });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/order-detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById({ id }).populate("products.product");
    if (!order) {
      return res.json({ products: [] });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
