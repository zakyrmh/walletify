const express = require("express");
const {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
} = require("../controllers/IncomeController");
const router = express.Router();

router.get("/api/incomes", getIncomes);
router.post("/api/income", createIncome);
router.put("/api/income/:id", updateIncome);
router.delete("/api/income/:id", deleteIncome);

module.exports = router;
