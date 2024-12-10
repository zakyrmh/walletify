import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
// Overview
import Overview from "./pages/Overview/Overview";

import Expense from "./pages/Expenses/ExpensePages";
import ShowExpense from "./pages/Expenses/ShowExpense";
import CreateExpense from "./pages/Expenses/CreateExpense";
import UpdateExpense from "./pages/Expenses/UpdateExpense";
// Income
import IncomesPage from "./pages/Incomes/IncomePage";
import CreateIncome from "./pages/Incomes/CreateIncome";

// Transfers
import TransferPage from "./pages/Transfers/TransfersPage";
import CreateTransfer from "./pages/Transfers/CreateTransfer";
// Wallets
import WalletsPage from "./pages/Wallets/WalletsPage";
import CreateWallet from "./pages/Wallets/CreateWallet";
import UpdateWallet from "./pages/Wallets/UpdateWallet";
// Categories
import CategoriesPage from "./pages/Categories/CategoriesPage";
import CreateCategory from "./pages/Categories/CreateCategory";
import UpdateCategory from "./pages/Categories/UpdateCategory";

const App = () => {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/expenses" element={<Expense />} />
        <Route path="/expense/:id" element={<ShowExpense />} />
        <Route path="/expense/create" element={<CreateExpense />} />
        <Route path="/expense/update/:id" element={<UpdateExpense />} />

        <Route path="/incomes" element={<IncomesPage />} />
        <Route path="/income/create" element={<CreateIncome />} />

        <Route path="/transfers" element={<TransferPage />} />
        <Route path="/transfer/create" element={<CreateTransfer />} />

        <Route path="/wallets" element={<WalletsPage />} />
        <Route path="/wallet/create" element={<CreateWallet />} />
        <Route path="/wallet/update/:id" element={<UpdateWallet />} />

        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/create" element={<CreateCategory />} />
        <Route path="/category/update/:id" element={<UpdateCategory />} />
      </Routes>
    </Router>
  );
};

export default App;
