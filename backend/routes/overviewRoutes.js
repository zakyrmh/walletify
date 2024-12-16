const express = require("express");
const {
  getTotalExpenseByCategory,
} = require("../controllers/OverviewController");
const router = express.Router();

router.get("/api/overview", getTotalExpenseByCategory);

module.exports = router;
