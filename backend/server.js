const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const walletRoutes = require("./routes/walletRoutes");
const categoriesRoutes = require("./routes/categoryRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const transferRoutes = require("./routes/transferRoutes");
const overviewRoutes = require("./routes/overviewRoutes");

const app = express();
require("dotenv").config();

const port = process.env.PORT;
const dbUrl = process.env.DB_URL;

const conn = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Could not connect to database:", error.message);
  }
};
conn();

app.use(cors());
app.use(express.json());
app.use(walletRoutes);
app.use(categoriesRoutes);
app.use(incomeRoutes);
app.use(expenseRoutes);
app.use(transferRoutes);
app.use(overviewRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
