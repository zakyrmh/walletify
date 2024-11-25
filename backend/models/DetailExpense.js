const mongoose = require("mongoose");

const detailExpenseSchema = new mongoose.Schema({
  expenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expense",
    required: true,
  }, // Hubungan ke Expense
  description: { type: String, required: true }, // Deskripsi detail pengeluaran
  amount: { type: Number, required: true }, // Jumlah harga per item
  quantity: { type: Number, required: true }, // Kuantitas item
});

module.exports = mongoose.model("DetailExpense", detailExpenseSchema);
