import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorPage from "../../components/ErrorPage";

const IncomePage = () => {
  const [groupedIncomes, setGroupedIncomes] = useState({});
  const [incomes, setIncomes] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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

  const groupByDate = (incomes) => {
    return incomes.reduce((grouped, income) => {
      const date = new Date(income.datetime).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(income);
      return grouped;
    }, {});
  };

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await fetch("http://localhost:5000/incomes");
        const data = await response.json();

        // Gabungkan transaksi dengan nama dompet
        const updatedData = data.map((income) => ({
          ...income,
          walletName: getWalletName(income.walletId),
        }));

        const grouped = groupByDate(updatedData);
        setGroupedIncomes(grouped);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWallets().then(fetchIncomes);
  }, [getWalletName]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/income/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.message}`);
        return;
      }

      setIncomes(incomes.filter((income) => income._id !== id));
      alert("Income deleted successfully!");
      setTimeout(() => {
        navigate("/income");
      }, 1000);
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income. Please try again.");
    }
  };

  if (error) return <ErrorPage pageName="Income" error={error} />;

  return (
    <div className="my-8 mr-6 ml-80">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Income</h1>
        <Link to="/income/create">
          <button className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Add
          </button>
        </Link>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <span className="loader"></span>
        </div>
      ) : (
        <>
          {Object.entries(groupedIncomes).map(([date, incomes]) => (
            <div
              key={date}
              className="bg-slate-700/20 flex flex-col gap-3 rounded-xl shadow-xl w-auto p-4 mt-8"
            >
              <div className="flex justify-between item-center">
                <h2 className="text-lg font-semibold">{date}</h2>
                <p className="text-lg font-semibold">
                  Rp
                  {incomes
                    .reduce((amount, income) => amount + income.amount, 0)
                    .toLocaleString("id-ID")}
                </p>
              </div>
              {incomes.map((income) => (
                <Link
                  key={income._id}
                  to={`/income/${income._id}`}
                  className="bg-white flex items-center justify-between rounded-lg shadow-lg py-2 px-3"
                >
                  <div>
                    <h2>{income.description}</h2>

                    <p className="text-sm">
                      {new Date(income.datetime).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex justify-end items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold">
                        Rp{Math.abs(income.amount).toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm">{income.walletName}</p>
                    </div>
                    <div className="divide-x">
                      <Link to={`/income/update/${income._id}`}>
                        <button className="text-indigo-600 px-2">Update</button>
                      </Link>
                      <button
                        className="text-red-600 px-2"
                        onClick={() => handleDelete(income._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default IncomePage;
