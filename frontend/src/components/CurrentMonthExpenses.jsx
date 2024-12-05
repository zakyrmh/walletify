import { useState, useEffect } from "react";

const CurrentMonthExpenses = () => {
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:5000/expenses");
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data = await response.json();

      // Filter expenses for the current month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const currentMonthExpenses = data.filter((expense) => {
        const expenseDate = new Date(expense.datetime); // Assumes expense has a `date` field
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear &&
          expense.recordAsExpense === true
        );
      });

      // Calculate total and average
      const totalAmount = currentMonthExpenses.reduce(
        (sum, expense) => sum + expense.total,
        0
      );

      // Get the current day of the month
      const currentDay = new Date().getDate(); // Get the current day of the month (e.g., 5 for 5th)

      // Calculate average based on the current day of the month
      const averageAmount =
        currentMonthExpenses.length > 0 ? totalAmount / currentDay : 0;

      setTotal(totalAmount);
      setAverage(averageAmount);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div>
        <p>Total Pengeluaran</p>
        <p>Rata-rata Pengeluaran</p>
      </div>
      <div>
        <p>Rp{total.toLocaleString()}</p>
        <p>Rp{average.toLocaleString()}</p>
      </div>
    </>
  );
};

export default CurrentMonthExpenses;
