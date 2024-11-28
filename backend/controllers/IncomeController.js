const Income = require("../models/Income");

const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().populate("walletId");
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createIncome = async (req, res) => {
  try {
    const { description, amount, walletId, date, categoryId } = req.body;

    if (!description || !amount || !walletId || !date || !categoryId) {
      return res
        .status(400)
        .json({
          message:
            "Description, amount, walletId, date, and categoryId are required.",
        });
    }

    const income = new Income({
      description,
      amount,
      walletId,
      date,
      categoryId,
    });
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, walletId, date, categoryId } = req.body;

    if (!description || !amount || !walletId || !date || !categoryId) {
      return res
        .status(400)
        .json({
          message:
            "Description, amount, walletId, date, and categoryId are required.",
        });
    }

    const income = await Income.findByIdAndUpdate(
      id,
      { description, amount, walletId, date, categoryId },
      { new: true }
    );

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    await Income.findByIdAndDelete(id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getIncomes, createIncome, updateIncome, deleteIncome };
