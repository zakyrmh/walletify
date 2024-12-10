const Category = require("../models/Category");
const DetailExpense = require("../models/DetailExpense");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryExpenses = async (req, res) => {
  try {
    const detailExpenses = await DetailExpense.find().populate({
      path: "items.categoryId",
      select: "name",
    });

    const result = detailExpenses.map((detail) => {
      return detail.items.map((item) => {
        const categoryName = item.categoryId?.name || "Unknown Category";
        const expenseTotal = item.amount || 0;
        return { name: categoryName, total: expenseTotal };
      });
    });

    const mergedResult = result.flat().reduce((acc, curr) => {
      const existing = acc.find((item) => item.name === curr.name);
      if (existing) {
        existing.total += curr.total;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    res.status(200).json(mergedResult);
  } catch (error) {
    console.error("Error Details:", error);
    res.status(500).json({
      message: "Error fetching category expenses",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryExpenses,
};
