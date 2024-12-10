import TotalBalance from "./components/TotalBalance";
import Statistics from "./components/Statistics";
import ExpensebyCategory from "./components/ExpensebyCategory";
const Overview = () => {
  return (
    <div className="my-8 mr-6 ml-80">
      <h1 className="text-2xl font-bold">My Dashboard</h1>
      <div className="flex justify-between gap-4 mt-8">
        <div className="flex flex-col gap-4 w-full">
          <TotalBalance />
          <ExpensebyCategory />
        </div>
        <div className="w-full">
          <Statistics />
        </div>
      </div>
    </div>
  );
};

export default Overview;
