const express = require("express");
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/ExpenseController");
const router = express.Router();

router.get("/expenses", getExpenses);
router.get("/expenses/:id", getExpense);
router.post("/expenses", createExpense);
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);

module.exports = router;
