const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  nameItem: { type: String, required: true },
  priceItem: { type: Number, required: true },
  quantityItem: { type: Number, required: true },
  amountItem: { type: Number, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  datetime: { type: Date, required: true },
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  total: { type: Number, required: true },
  recordAsExpense: { type: Boolean, required: true },
  items: [itemSchema],
});

module.exports = mongoose.model("Expense", expenseSchema);
