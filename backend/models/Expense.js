const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  datetime: { type: Date, default: Date.now },
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  detailId: { type: mongoose.Schema.Types.ObjectId, ref: "DetailExpense" },
  total: { type: Number, required: false },
});

module.exports = mongoose.model("Expense", expenseSchema);
