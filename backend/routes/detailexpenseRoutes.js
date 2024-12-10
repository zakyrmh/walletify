const express = require("express");
const { getDetailExpenses } = require("../controllers/DetailExpenseController");
const router = express.Router();

router.get("/api/detailexpenses", getDetailExpenses);
// router.post("/expenses", createExpense);
// router.put("/expenses/:id", updateExpense);
// router.delete("/expenses/:id", deleteExpense);

module.exports = router;
