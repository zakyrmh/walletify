const express = require("express");
const router = express.Router();
const Income = require("../models/Income");

// GET semua pemasukkan
router.get("/", async (req, res) => {
  try {
    const incomes = await Income.find().populate("walletId");
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST pemasukkan baru
router.post("/", async (req, res) => {
  const { description, amount, walletId } = req.body;

  try {
    const income = new Income({ description, amount, walletId });
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE pemasukkan
router.delete("/:id", async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Pemasukkan tidak ditemukan" });
    }
    res.status(200).json({ message: "Pemasukkan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
