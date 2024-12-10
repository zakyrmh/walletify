const express = require("express");
const {
  getCategories,
  getCategory,
  getCategoryExpenses,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController");
const router = express.Router();

router.get("/api/categories", getCategories);
router.get("/api/category/:id", getCategory);
router.get("/api/category-expenses", getCategoryExpenses);
router.post("/api/category", createCategory);
router.put("/api/category/:id", updateCategory);
router.delete("/api/category/:id", deleteCategory);

module.exports = router;
