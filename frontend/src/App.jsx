import Overview from "./pages/Overview";
import Sidebar from "./components/Sidebar";
const App = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-72">
        <Overview />
      </div>
    </div>
  );
};

export default App;
