const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const DetailExpense = require("../models/DetailExpense");

// GET semua pengeluaran
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().populate("walletId");
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST pengeluaran baru
router.post("/", async (req, res) => {
  const { walletId, details } = req.body;

  try {
    // Hitung totalAmount dari details
    const totalAmount = details.reduce(
      (sum, item) => sum + item.amount * item.quantity,
      0
    );

    // Buat pengeluaran utama
    const expense = new Expense({ walletId, totalAmount });
    await expense.save();

    // Buat detail pengeluaran
    const detailPromises = details.map((detail) => {
      return DetailExpense.create({
        expenseId: expense._id,
        description: detail.description,
        amount: detail.amount,
        quantity: detail.quantity,
      });
    });
    await Promise.all(detailPromises);

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET pengeluaran dengan rincian
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate("walletId");
    if (!expense) {
      return res.status(404).json({ message: "Pengeluaran tidak ditemukan" });
    }

    const details = await DetailExpense.find({ expenseId: expense._id });
    res.status(200).json({ ...expense._doc, details });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
