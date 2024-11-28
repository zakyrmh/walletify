const express = require("express");
const {
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/ExpenseController");
const router = express.Router();

router.get("/expenses", getExpense);
router.post("/expenses", createExpense);
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);

module.exports = router;
