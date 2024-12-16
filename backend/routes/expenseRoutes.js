const express = require("express");
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/ExpenseController");
const router = express.Router();

router.get("/api/expenses", getExpenses);
router.get("/api/expense/:id", getExpense);
router.post("/api/expense", createExpense);
router.put("/api/expense/:id", updateExpense);
router.delete("/api/expense/:id", deleteExpense);

module.exports = router;
