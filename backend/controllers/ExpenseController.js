const Expense = require("../models/Expense");
const Wallet = require("../models/Wallet");

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { description, datetime, walletId, recordAsExpense, items } =
      req.body;

    // Calculate amountItem and total
    const updatedItems = items.map((item) => ({
      ...item,
      amountItem: item.priceItem * item.quantityItem,
    }));
    const total = updatedItems.reduce((sum, item) => sum + item.amountItem, 0);

    // Find wallet and adjust balance
    const wallet = await Wallet.findById(walletId);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    if (wallet.balance < total) {
      return res
        .status(400)
        .json({ message: "Insufficient balance in wallet" });
    }

    wallet.balance -= total;
    await wallet.save();

    const expense = new Expense({
      description,
      datetime,
      walletId,
      total,
      recordAsExpense,
      items: updatedItems,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, datetime, walletId, recordAsExpense, items } =
      req.body;

    // Calculate new amountItem and total
    const updatedItems = items.map((item) => ({
      ...item,
      amountItem: item.priceItem * item.quantityItem,
    }));
    const newTotal = updatedItems.reduce(
      (sum, item) => sum + item.amountItem,
      0
    );

    const existingExpense = await Expense.findById(id);
    if (!existingExpense)
      return res.status(404).json({ message: "Expense not found" });

    // Adjust wallet balance for old and new values
    const oldWallet = await Wallet.findById(existingExpense.walletId);
    if (!oldWallet)
      return res.status(404).json({ message: "Old wallet not found" });

    // Revert old total
    oldWallet.balance += existingExpense.total;
    await oldWallet.save();

    // Handle wallet change
    if (walletId !== existingExpense.walletId.toString()) {
      const newWallet = await Wallet.findById(walletId);
      if (!newWallet)
        return res.status(404).json({ message: "New wallet not found" });

      if (newWallet.balance < newTotal) {
        return res
          .status(400)
          .json({ message: "Insufficient balance in new wallet" });
      }

      // Deduct from new wallet
      newWallet.balance -= newTotal;
      await newWallet.save();
    } else {
      // Deduct from the same wallet
      if (oldWallet.balance < newTotal) {
        return res
          .status(400)
          .json({ message: "Insufficient balance in wallet" });
      }

      oldWallet.balance -= newTotal;
      await oldWallet.save();
    }

    // Update the expense
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        description,
        datetime,
        walletId,
        total: newTotal,
        recordAsExpense,
        items: updatedItems,
      },
      { new: true }
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const existingExpense = await Expense.findById(id);
    if (!existingExpense)
      return res.status(404).json({ message: "Expense not found" });

    // Find wallet and return the balance
    const wallet = await Wallet.findById(existingExpense.walletId);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    wallet.balance += existingExpense.total;
    await wallet.save();

    // Delete the expense
    await existingExpense.deleteOne();

    res
      .status(200)
      .json({ message: "Expense deleted and balance returned to wallet" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};
