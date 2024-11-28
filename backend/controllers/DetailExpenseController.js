const DetailExpense = require("../models/DetailExpense");

const getDetailExpense = async (req, res) => {
  try {
    const detailExpenses = await DetailExpense.find();
    res.status(200).json(detailExpenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDetailExpense };
