const express = require("express");
const app = express();
const mongoose = require("mongoose");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const detailRoutes = require("./routes/detailexpenseRoutes");
const walletRoutes = require("./routes/walletRoutes");

// Middleware
app.use(express.json());

// Rute
app.use("/api/incomes", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/detail-expenses", detailRoutes);
app.use("/api/wallets", walletRoutes);

// Koneksi ke database
mongoose
  .connect("mongodb://localhost:27017/financeApp")
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err));

// Menjalankan server
PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
