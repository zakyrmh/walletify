const Income = require("../models/Income");
const Wallet = require("../models/Wallet");

const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find();
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findById(id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createIncome = async (req, res) => {
  try {
    const { description, amount, walletId, datetime, categoryId } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required." });
    }
    if (!amount) {
      return res.status(400).json({ message: "Amount is required." });
    }
    if (!walletId) {
      return res.status(400).json({ message: "Wallet is required." });
    }
    if (!datetime) {
      return res.status(400).json({ message: "Datetime is required." });
    }
    if (!categoryId) {
      return res.status(400).json({ message: "Category is required." });
    }

    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ message: "Invalid wallet." });
    }

    const income = new Income({
      description,
      amount,
      walletId,
      datetime,
      categoryId,
    });
    await income.save();

    wallet.balance = Number(wallet.balance) + Number(amount);
    await wallet.save();

    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, walletId, datetime, categoryId } = req.body;

    // Cari income awal sebelum di-update
    const initialIncome = await Income.findById(id);
    if (!initialIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    // Validasi input
    if (!description) {
      return res.status(400).json({ message: "Description is required." });
    }
    if (!amount) {
      return res.status(400).json({ message: "Amount is required." });
    }
    if (!walletId) {
      return res.status(400).json({ message: "Wallet is required." });
    }
    if (!datetime) {
      return res.status(400).json({ message: "Datetime is required." });
    }
    if (!categoryId) {
      return res.status(400).json({ message: "Category is required." });
    }

    // Ambil wallet baru
    const newWallet = await Wallet.findById(walletId);
    if (!newWallet) {
      return res.status(404).json({ message: "Invalid wallet." });
    }

    // Jika wallet berubah, sesuaikan saldo wallet lama dan baru
    if (initialIncome.walletId.toString() !== walletId) {
      const oldWallet = await Wallet.findById(initialIncome.walletId);
      if (!oldWallet) {
        return res.status(404).json({ message: "Old wallet not found." });
      }

      // Update saldo wallet lama
      oldWallet.balance -= initialIncome.amount;
      await oldWallet.save();

      // Update saldo wallet baru
      newWallet.balance += Number(amount);
      await newWallet.save();
    } else {
      // Jika wallet tidak berubah, hanya update saldo wallet yang sama
      newWallet.balance =
        newWallet.balance - initialIncome.amount + Number(amount);
      await newWallet.save();
    }

    // Update income
    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { description, amount, walletId, datetime, categoryId },
      { new: true }
    );

    if (!updatedIncome) {
      return res
        .status(404)
        .json({ message: "Income not found after update." });
    }

    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findById(id);

    if (!income) {
      return res.status(404).json({ message: "Income not found." });
    }

    const wallet = await Wallet.findById(income.walletId);
    if (!wallet) {
      return res.status(404).json({ message: "Invalid wallet." });
    }

    wallet.balance = Number(wallet.balance) - Number(income.amount);

    await wallet.save();
    await Income.findByIdAndDelete(id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
};
