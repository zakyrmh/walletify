const Expense = require("../models/Expense");
const Category = require("../models/Category");

const getTotalExpenseByCategory = async (req, res) => {
  try {
    const expensesByCategory = await Expense.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "categories",
          localField: "items.categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "$categoryDetails.name",
          total: { $sum: "$items.amountItem" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
    ]);

    const formattedResponse = expensesByCategory.map((entry) => ({
      category: entry.category,
      total: `Rp${entry.total.toLocaleString("id-ID")}`,
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error fetching total expenses by category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getTotalExpenseByCategory };
