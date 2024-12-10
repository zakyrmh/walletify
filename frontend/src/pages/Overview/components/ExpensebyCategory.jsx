import { useEffect, useState } from "react";
import axios from "axios";

const ExpensebyCategory = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/category-expenses"
        );
        setExpenses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError("Failed to fetch expenses.");
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full">
      <h2 className="text-[#878787] text-lg">Expense by Category</h2>
      <div className="bg-white rounded-lg shadow-lg px-6 py-5 mt-2">
        {expenses.map((expense, index) => (
          <div key={index} className="flex justify-between items-center gap-4">
            <div>
              <p className="text-sm pb-3">{expense.name}</p>
            </div>
            <div>
              <p className="font-semibold pb-3">
                Rp{expense.total.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensebyCategory;
