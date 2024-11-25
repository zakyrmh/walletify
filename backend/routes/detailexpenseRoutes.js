const express = require("express");
const router = express.Router();
const DetailExpense = require("../models/DetailExpense");

// GET semua detail pengeluaran
router.get("/", async (req, res) => {
  try {
    const details = await DetailExpense.find().populate("expenseId");
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST detail pengeluaran baru
router.post("/", async (req, res) => {
  const { expenseId, description, amount, quantity } = req.body;

  try {
    const detail = new DetailExpense({
      expenseId,
      description,
      amount,
      quantity,
    });
    await detail.save();
    res.status(201).json(detail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE detail pengeluaran
router.delete("/:id", async (req, res) => {
  try {
    const detail = await DetailExpense.findByIdAndDelete(req.params.id);
    if (!detail) {
      return res
        .status(404)
        .json({ message: "Detail pengeluaran tidak ditemukan" });
    }
    res.status(200).json({ message: "Detail pengeluaran berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
