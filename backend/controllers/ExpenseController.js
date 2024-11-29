const Expense = require("../models/Expense");
const DetailExpense = require("../models/DetailExpense");
const Wallet = require("../models/Wallet");

const getExpense = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { description, date, walletId, details } = req.body;

    // Validasi data input
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

    // Hitung total amount untuk setiap item dan total keseluruhan
    let totalAmount = 0;
    const updatedDetails = details.map((item) => {
      // Menghitung amount untuk setiap item
      const amount = Number(item.cost) * Number(item.quantity);
      totalAmount += amount; // Menjumlahkan amount ke total

      // Return updated item dengan amount yang sudah dihitung
      return { ...item, amount };
    });

    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ message: "Invalid walletId." });
    }

    // Membuat expense
    const expense = new Expense({
      description,
      datetime: date || new Date(),
      walletId,
      total: totalAmount, // Menyimpan total ke dalam expense
    });

    // Simpan expense
    await expense.save();

    // Membuat DetailExpense
    const detailExpense = new DetailExpense({
      expenseId: expense._id,
      items: updatedDetails, // Menggunakan updated details dengan amount
    });

    // Simpan detailExpense
    await detailExpense.save();

    // Update expense dengan detailId yang mengacu ke detailExpense
    expense.detailId = detailExpense._id;
    await expense.save();

    wallet.balance = Number(wallet.balance) - Number(totalAmount);
    await wallet.save();

    // Kembalikan response dengan detail expense yang sudah dibuat
    res.status(201).json({ expense, detailExpense });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, date, walletId, details } = req.body;

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

    const expense = await Expense.findByIdAndUpdate(
      id,
      { description, date: date || new Date(), walletId },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    if (details) {
      const detailExpense = await DetailExpense.findOneAndUpdate(
        { expenseId: expense._id },
        { items: details },
        { new: true }
      );
      if (!detailExpense) {
        return res.status(404).json({
          message: "DetailExpense associated with the expense not found.",
        });
      }
    }

    res.status(200).json({ message: "Expense updated successfully.", expense });
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

module.exports = { getExpense, createExpense, updateExpense, deleteExpense };
