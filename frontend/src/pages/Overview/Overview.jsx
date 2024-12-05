import TotalBalance from "./components/TotalBalance";
import Statistics from "./components/Statistics";
const Overview = () => {
  return (
    <div className="my-8 mr-6 ml-80">
      <h1 className="text-2xl font-bold">My Dashboard</h1>
      <div className="flex justify-between gap-4 mt-8">
        <TotalBalance />
        <Statistics />
      </div>
    </div>
  );
};

export default Overview;
