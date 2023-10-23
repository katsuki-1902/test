const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  isActive: Boolean,
  level: Number,
  child: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
  name: String,
  image: String,
  slug: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  description: String,
  classify: String,
  price: Number,
  inventory: Number,
  sold: Number,
  isActive: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      classify: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      classify: String,
    },
  ],
  total: Number,
  status: String,
  note: String,
  name: String,
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = {
  CategorySchema,
  ProductSchema,
  UserSchema,
  CartSchema,
  OrderSchema,
};
