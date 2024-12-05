const Expense = require("../models/Expense");
const DetailExpense = require("../models/DetailExpense");
const Wallet = require("../models/Wallet");

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id).populate("detailId");
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { description, datetime, walletId, details, recordAsExpense } =
      req.body;

    if (!description || !walletId) {
      return res
        .status(400)
        .json({ message: "description and walletId are required." });
    }

    if (!details || !Array.isArray(details)) {
      return res
        .status(400)
        .json({ message: "details must be a valid array." });
    }

    let totalAmount = 0;
    const updatedDetails = details.map((item) => {
      const amount = Number(item.cost) * Number(item.quantity);
      totalAmount += amount;

      return { ...item, amount };
    });

    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ message: "Invalid walletId." });
    }

    const expense = new Expense({
      description,
      datetime,
      walletId,
      total: totalAmount,
      recordAsExpense,
    });

    await expense.save();

    const detailExpense = new DetailExpense({
      expenseId: expense._id,
      items: updatedDetails,
    });

    await detailExpense.save();

    expense.detailId = detailExpense._id;
    await expense.save();

    wallet.balance = Number(wallet.balance) - Number(totalAmount);
    await wallet.save();

    res.status(201).json({ expense, detailExpense });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, datetime, walletId, details, recordAsExpense } =
      req.body;

    if (!description || !walletId) {
      return res
        .status(400)
        .json({ message: "description and walletId are required." });
    }

    if (details && !Array.isArray(details)) {
      return res
        .status(400)
        .json({ message: "details must be a valid array." });
    }

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    const previousTotal = expense.total;
    const previousWalletId = expense.walletId;
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ message: "Invalid walletId." });
    }

    let newTotal = 0;
    const updatedDetails = details.map((item) => {
      const amount = Number(item.cost) * Number(item.quantity);
      newTotal += amount;
      return { ...item, amount };
    });

    // Jika walletId diubah, sesuaikan saldo wallet lama
    if (previousWalletId.toString() !== walletId.toString()) {
      const previousWallet = await Wallet.findById(previousWalletId);
      if (previousWallet) {
        previousWallet.balance += previousTotal;
        await previousWallet.save();
      }
    } else {
      // Jika walletId sama, kembalikan saldo sebelumnya
      wallet.balance += previousTotal;
    }

    // Update saldo wallet baru
    if (recordAsExpense) {
      wallet.balance -= newTotal;
    }
    await wallet.save();

    // Update expense
    expense.description = description;
    expense.datetime = datetime || expense.datetime;
    expense.walletId = walletId;
    expense.total = newTotal;
    expense.recordAsExpense = recordAsExpense;
    await expense.save();

    // Update DetailExpense
    const detailExpense = await DetailExpense.findOne({ expenseId: id });
    if (detailExpense) {
      detailExpense.items = updatedDetails;
      await detailExpense.save();
    } else {
      return res.status(404).json({
        message: "DetailExpense associated with the expense not found.",
      });
    }

    res.status(200).json({
      message: "Expense updated successfully.",
      expense,
      detailExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    await DetailExpense.findOneAndDelete({ expenseId: id });

    await Expense.findByIdAndDelete(id);

    res.status(200).json({
      message: "Expense and associated details deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};
