const mongoose = require("mongoose");

const detailExpenseSchema = new mongoose.Schema({
  expenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expense",
    required: true,
  },
  items: [
    {
      description: { type: String, required: true },
      cost: { type: Number, required: true },
      quantity: { type: Number, required: true },
      amount: { type: Number, required: true },
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("DetailExpense", detailExpenseSchema);
