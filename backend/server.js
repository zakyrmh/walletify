const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const walletRoutes = require("./routes/walletRoutes");
const categoriesRoutes = require("./routes/categoryRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const detailExpenseRoutes = require("./routes/detailexpenseRoutes");
const transferRoutes = require("./routes/transferRoutes");

const app = express();
mongoose.connect("mongodb://localhost:27017/financeApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Database"));

app.use(cors());
app.use(express.json());
app.use(walletRoutes);
app.use(categoriesRoutes);
app.use(incomeRoutes);
app.use(expenseRoutes);
app.use(detailExpenseRoutes);
app.use(transferRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
