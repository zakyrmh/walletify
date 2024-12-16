const express = require("express");
const {
  getIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} = require("../controllers/IncomeController");
const router = express.Router();

router.get("/api/incomes", getIncomes);
router.get("/api/income/:id", getIncome);
router.post("/api/income", createIncome);
router.put("/api/income/:id", updateIncome);
router.delete("/api/income/:id", deleteIncome);

module.exports = router;
