import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import Wallets from "./pages/Wallets";
const App = () => {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/wallets" element={<Wallets />} />
      </Routes>
    </Router>
  );
};

export default App;
