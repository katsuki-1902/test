const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { CartSchema, OrderSchema, UserSchema } = require("./schema");

const Cart = mongoose.model("Cart", CartSchema);
const Order = mongoose.model("Order", OrderSchema);
const User = mongoose.model("User", UserSchema);

router.get("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findOne({
      user: id,
    }).populate("products.product");
    if (!cart) {
      return res.json({ products: [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add-to-cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { product, quantity, addMore, classify } = req.body;
    const cart = await Cart.findOne({
      user: id,
    });
    if (cart) {
      const itemIndex = cart.products.findIndex((p) => p.product == product._id);
      if (itemIndex > -1 && cart.products[itemIndex].classify == classify) {
        const productItem = cart.products[itemIndex];
        productItem.quantity = addMore ? productItem.quantity + quantity : quantity;
        cart.products[itemIndex] = productItem;
      } else {
        cart.products.push({ product, quantity, classify });
      }
      await cart.save();
      return res.json(cart);
    } else {
      const newCart = new Cart({
        user: id,
        products: [{ product, quantity, classify }],
      });
      await newCart.save();
      return res.json(newCart);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/remove-from-cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { product } = req.body;
    const cart = await Cart.findOne({
      user: id,
    });
    if (cart) {
      const itemIndex = cart.products.findIndex((p) => p.product == product._id);
      if (itemIndex > -1) {
        cart.products.splice(itemIndex, 1);
      }
      await cart.save();
      return res.json(cart);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/checkout/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const user = await User.findById(id);
    const curCart = await Cart.findOne({
      user: id,
    }).populate("products.product");
    const products = curCart.products;

    const total = products.reduce((total, product) => {
      return total + product.product.price * product.quantity;
    }, 0);

    const newOrder = new Order({
      user: id,
      products,
      total,
      note,
      phone: user.phone,
      address: user.address,
    });
    await newOrder.save();
    const cart = await Cart.findOneAndDelete({
      user: id,
    });
    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/checkout-anonymous", async (req, res) => {
  const { products, total, note, name, phone, address } = req.body;
  const newOrder = new Order({
    products,
    total,
    note,
    name,
    phone,
    address,
  });
  await newOrder.save();
  res.json(newOrder);
});

module.exports = router;
