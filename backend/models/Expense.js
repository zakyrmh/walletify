const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  }, // Hubungan ke Wallet
  totalAmount: { type: Number, required: true }, // Total dari semua detail
  date: { type: Date, default: Date.now }, // Tanggal pengeluaran
});

module.exports = mongoose.model("Expense", expenseSchema);
