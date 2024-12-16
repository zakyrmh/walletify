const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController");
const router = express.Router();

router.get("/api/categories", getCategories);
router.get("/api/category/:id", getCategory);
router.post("/api/category", createCategory);
router.put("/api/category/:id", updateCategory);
router.delete("/api/category/:id", deleteCategory);

module.exports = router;
