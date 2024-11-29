import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import Wallets from "./pages/Wallets";
import Incomes from "./pages/Incomes";
import Transfer from "./pages/Transfer";
import Category from "./pages/Category";

const App = () => {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/incomes" element={<Incomes />} />
        <Route path="/transfers" element={<Transfer />} />
        <Route path="/categories" element={<Category />} />
      </Routes>
    </Router>
  );
};

export default App;
