const express = require("express");
const mongoose = require("mongoose");
const slugify = require("slugify");
const router = express.Router();
const { CategorySchema } = require("./schema");

const Category = mongoose.model("Category", CategorySchema);

router.post("/categories", async (req, res) => {
  try {
    const { name, level } = req.body;

    const category = new Category({
      name,
      slug: slugify(name, {
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
        remove: /[*+~.()'"!:@]/g,
      }),
      isActive: true,
      level,
    });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all categories
router.get("/categories", async (req, res) => {
  try {
    const { isActive } = req.query;
    if (isActive === undefined) {
      const categories = await Category.find({
        level: 1,
      })
        .populate("child")
        .exec();
      return res.json(categories);
    }
    const categories = await Category.find({
      level: 1,
      isActive: isActive === "true" ? true : false,
    })
      .populate({
        path: "child",
        match: { isActive: true }, // Filter child items with isActive set to true
      })
      .exec();

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/sub-categories", async (req, res) => {
  try {
    const categories = await Category.find({
      level: 2,
      isActive: true,
    });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/category/:slug", async (req, res) => {
  try {
    const { child } = req.body;
    const category = await Category.findOneAndUpdate({ slug: req.params.slug }, { child }, { new: true }).catch(
      (err) => {
        console.log(err);
      }
    );
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/category-status/:slug", async (req, res) => {
  try {
    const { isActive } = req.body;
    const category = await Category.findOneAndUpdate({ slug: req.params.slug }, { isActive }, { new: true }).catch(
      (err) => {
        console.log(err);
      }
    );
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/category/:slug", async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    } else {
      await Category.deleteMany({
        _id: {
          $in: category.child?.map((item) => item._id),
        },
      });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
