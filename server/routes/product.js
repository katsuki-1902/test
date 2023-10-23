const express = require("express");
const mongoose = require("mongoose");
const slugify = require("slugify");
const router = express.Router();
const { ProductSchema, CategorySchema, CartSchema } = require("./schema");

const Product = mongoose.model("Product", ProductSchema);
const Category = mongoose.model("Category", CategorySchema);
const Cart = mongoose.model("Cart", CartSchema);

router.post("/products", async (req, res) => {
  try {
    const { name, image, category, description, price, inventory, sold, isActive, classify } = req.body;
    const product = new Product({
      name,
      image,
      slug: slugify(name, {
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
        remove: /[*+~.()'"!:@]/g,
      }),
      category,
      description,
      price,
      inventory,
      classify,
      sold,
      isActive,
    });
    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Read all products
router.get("/products", async (req, res) => {
  try {
    const { limit, offset, isActive, key } = req.query;

    if (isActive === undefined) {
      const products = await Product.find({
        name: { $regex: key ?? "", $options: "i" },
      })
        .populate("category")

        .limit(parseInt(limit))
        .skip(parseInt(offset));
      return res.json(products);
    } else {
      const products = await Product.find({
        isActive: isActive === "true" ? true : false,
      })
        .populate("category")

        .limit(parseInt(limit))
        .skip(parseInt(offset));
      res.json(products);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products/count", async (req, res) => {
  try {
    const isActive = req.query.isActive;
    const key = req.query.key;
    if (isActive === undefined) {
      const productsCount = await Product.countDocuments({
        name: { $regex: key ?? "", $options: "i" },
      });
      return res.json({ count: productsCount });
    } else {
      const productsCount = await Product.countDocuments({
        isActive: isActive === "true" ? true : false,
        name: { $regex: key ?? "", $options: "i" },
      });
      return res.json({ count: productsCount });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read a single product by ID
router.get("/products/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("category");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products/category/:category", async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const category = await Category.findOne({ slug: req.params.category });
    if (!category) {
      // Handle the case where the category doesn't exist
      return [];
    }

    if (category.level === 1) {
      const subCategories = await Category.find({
        _id: { $in: category.child.map((child) => child._id) },
      });
      const subCategoryIds = subCategories.map((subCategory) => subCategory._id);
      const products = await Product.find({
        category: { $in: subCategoryIds },
      })
        .populate("category")
        .limit(parseInt(limit))
        .skip(parseInt(offset));
      return res.json(products);
    } else {
      const products = await Product.find({
        category: category._id,
      })
        .populate("category")
        .limit(parseInt(limit))
        .skip(parseInt(offset));
      return res.json(products);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/products/category/:category/count", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.category });
    if (!category) {
      // Handle the case where the category doesn't exist
      res.json({ count: 0 });
      return;
    }

    if (category.level === 1) {
      const subCategories = await Category.find({
        _id: { $in: category.child.map((child) => child._id) },
      });
      const subCategoryIds = subCategories.map((subCategory) => subCategory._id);
      const products = await Product.find({
        category: { $in: subCategoryIds },
      }).countDocuments();
      res.json({ count: products });
      return;
    } else {
      const products = await Product.find({
        category: category._id,
      }).countDocuments();
      res.json({ count: products });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update a product by ID
router.put("/products/:id", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product by ID
router.delete("/products/:id", async (req, res) => {
  try {
    const carts = await Cart.find();
    carts.forEach(async (cart) => {
      const itemIndex = cart.products.findIndex((p) => p.product == req.params.id);
      if (itemIndex > -1) {
        cart.products.splice(itemIndex, 1);
      }
      await cart.save();
    });

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(deletedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/fix-url", async (req, res) => {
  const products = await Product.find({});
  await products.forEach(async (product) => {
    product.slug = slugify(product.name, {
      lower: true,
      strict: true,
      locale: "vi",
      trim: true,
      remove: /[*+~.()'"!:@]/g,
    });
    await product.save();
  });
  res.json("ok");
});

module.exports = router;
