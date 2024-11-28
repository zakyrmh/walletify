const express = require("express");
const { getDetailExpense } = require("../controllers/DetailExpenseController");
const router = express.Router();

router.get("/detailexpenses", getDetailExpense);
// router.post("/expenses", createExpense);
// router.put("/expenses/:id", updateExpense);
// router.delete("/expenses/:id", deleteExpense);

module.exports = router;
