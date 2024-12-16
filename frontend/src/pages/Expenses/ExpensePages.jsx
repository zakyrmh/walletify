import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchExpenses } from "../../API/fetchExpenses";
import { fetchWallets } from "../../API/fetchWallets";
import ErrorPage from "../../components/ErrorPage";
import ModalPopUp from "../../components/ModalPopUp";
import SuccessPopUp from "../../components/SuccessPopUp";

const ExpensePages = () => {
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

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
    const fetchData = async () => {
      try {
        const walletsData = await fetchWallets();
        setWallets(walletsData);

        const expensesData = await fetchExpenses();
        const updatedData = expensesData.map((expense) => ({
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

    fetchData();
  }, [getWalletName]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/expense/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.message}`);
        return;
      }

      setExpenses(expenses.filter((expense) => expense._id !== id));
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/expenses");
      }, 1000);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  if (error) return <ErrorPage pageName="Income" error={error} />;

  return (
    <div className="my-8 mr-6 ml-80">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expense</h1>
        <Link to="/expense/create">
          <button className="rounded-md bg-teal-600 px-3 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
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
          {Object.entries(groupedExpenses).map(([date, expenses]) => (
            <div
              key={date}
              className="bg-slate-700/20 flex flex-col gap-3 rounded-xl shadow-xl w-auto p-4 mt-8"
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
                <div
                  key={expense._id}
                  className="bg-white flex items-center justify-between rounded-lg shadow-lg py-2 px-3"
                >
                  <Link
                    to={`/expense/${expense._id}`}
                    className="flex justify-between items-center gap-6 w-full"
                  >
                    <div>
                      <h2>{expense.description}</h2>

                      <p className="text-sm">
                        {new Date(expense.datetime).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        Rp{Math.abs(expense.total).toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm">{expense.walletName}</p>
                    </div>
                  </Link>
                  <div className="flex justify-end divide-x min-w-36">
                    <Link to={`/expense/update/${expense._id}`}>
                      <button className="text-indigo-600 px-2">Update</button>
                    </Link>
                    <button
                      className="text-red-600 px-2"
                      type="button"
                      onClick={() => setShowModal(true)}
                    >
                      Delete
                    </button>
                    {showModal && (
                      <ModalPopUp
                        heading={`Delete ${expense.description}`}
                        description="Are you sure you want to delete this expense? This action cannot be undone."
                        onClick={() => {
                          handleDelete(expense._id);
                          setShowModal(false);
                        }}
                        onClick2={() => setShowModal(false)}
                      />
                    )}
                    {showSuccess && (
                      <SuccessPopUp
                        heading={`Delete successful!`}
                        description="The expense has been deleted successfully."
                        onClick={() => setShowSuccess(false)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ExpensePages;
