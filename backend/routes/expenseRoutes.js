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
router.get("/api/expenses/:id", getExpense);
router.post("/api/expenses", createExpense);
router.put("/api/expenses/:id", updateExpense);
router.delete("/api/expenses/:id", deleteExpense);

module.exports = router;
