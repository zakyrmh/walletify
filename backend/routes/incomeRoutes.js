const express = require("express");
const {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
} = require("../controllers/IncomeController");
const router = express.Router();

router.get("/incomes", getIncomes);
router.post("/incomes", createIncome);
router.put("/incomes/:id", updateIncome);
router.delete("/incomes/:id", deleteIncome);

module.exports = router;
