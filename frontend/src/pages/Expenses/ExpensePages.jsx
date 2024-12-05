import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const ExpensePages = () => {
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWallets = async () => {
    try {
      const response = await fetch("http://localhost:5000/wallets");
      const data = await response.json();
      setWallets(data);
    } catch (err) {
      console.error("Error fetching wallets:", err);
    }
  };

  const getWalletName = useCallback(
    (walletId) => {
      const wallet = wallets.find((w) => w._id === walletId);
      return wallet ? wallet.name : "Unknown Wallet";
    },
    [wallets]
  );

  const groupByDate = (expenses) => {
    return expenses.reduce((grouped, expense) => {
      const date = new Date(expense.datetime).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(expense);
      return grouped;
    }, {});
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:5000/expenses");
        const data = await response.json();

        // Gabungkan transaksi dengan nama dompet
        const updatedData = data.map((expense) => ({
          ...expense,
          walletName: getWalletName(expense.walletId),
        }));

        const grouped = groupByDate(updatedData);
        setGroupedExpenses(grouped);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWallets().then(fetchExpenses);
  }, [getWalletName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-4 mr-6 ml-80">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expense</h1>
        <Link to="/add-expense">
          <button className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Add
          </button>
        </Link>
      </div>

      {Object.entries(groupedExpenses).map(([date, expenses]) => (
        <div
          key={date}
          className="bg-slate-700/20 flex flex-col gap-3 rounded-xl shadow-xl w-auto p-4 mt-4"
        >
          <div className="flex justify-between item-center">
            <h2 className="text-lg font-semibold">{date}</h2>
            <p className="text-lg font-semibold">
              Rp
              {expenses
                .reduce((total, expense) => total + expense.total, 0)
                .toLocaleString("id-ID")}
            </p>
          </div>
          {expenses.map((expense) => (
            <Link
              key={expense._id}
              to={`/expense/${expense._id}`}
              className="bg-white flex items-center justify-between rounded-lg shadow-lg py-2 px-3"
            >
              <div>
                <h2>{expense.description}</h2>

                <p className="text-sm">
                  {new Date(expense.datetime).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  Rp{Math.abs(expense.total).toLocaleString("id-ID")}
                </p>
                <p className="text-sm">{expense.walletName}</p>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ExpensePages;
