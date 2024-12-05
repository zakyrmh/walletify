import { useState, useEffect } from "react";

const Statistics = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [averageExpenses, setAverageExpenses] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/expenses");
        const data = await response.json();

        // Filter expenses with recordAsExpense = true
        const filteredExpenses = data.filter(
          (expense) => expense.recordAsExpense
        );

        // Calculate total expenses
        const total = filteredExpenses.reduce(
          (acc, expense) => acc + expense.total,
          0
        );
        setTotalExpenses(total);

        const today = new Date();
        const formattedDate = today.toLocaleDateString("id-ID", {
          day: "numeric",
        });

        // Calculate average expenses
        const average = total / formattedDate;
        setAverageExpenses(average);
      } catch (error) {
        console.error("Error fetching expenses data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="w-full">
      <h2 className="text-[#878787] text-lg">Total Balance</h2>
      <div className="bg-white flex justify-between items-center rounded-lg shadow-lg px-6 py-5 mt-2">
        <div>
          <p className="text-[#525256] text-sm pb-3">Total Pengeluaran</p>
          <p className="text-[#525256] text-sm pb-3">Rata-rata Pengeluaran</p>
        </div>
        <div>
          <p className="text-xl font-bold pb-3">
            Rp{totalExpenses.toLocaleString("id-ID")}
          </p>
          <p className="text-xl font-bold pb-3">
            Rp{averageExpenses.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
