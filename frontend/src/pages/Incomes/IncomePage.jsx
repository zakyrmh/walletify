import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWallets } from "../../API/fetchWallets";
import ErrorPage from "../../components/ErrorPage";
import ModalPopUp from "../../components/ModalPopUp";

const IncomePage = () => {
  const [groupedIncomes, setGroupedIncomes] = useState({});
  const [incomes, setIncomes] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getWallets = async () => {
      try {
        const data = await fetchWallets();
        setWallets(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getWallets();
  }, []);

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
        const response = await fetch("http://localhost:5000/api/incomes");
        const data = await response.json();

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
    try {
      const response = await fetch(`http://localhost:5000/api/income/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.message}`);
        return;
      }

      setIncomes(incomes.filter((income) => income._id !== id));
      setTimeout(() => {
        setShowModal(null);
        navigate("/incomes");
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
                <div
                  key={income._id}
                  className="bg-white flex items-center justify-between rounded-lg shadow-lg py-2 px-3"
                >
                  <Link
                    to={`/income/${income._id}`}
                    className="flex justify-between items-center gap-6 w-full"
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
                    <div className="text-right">
                      <p className="font-semibold">
                        Rp{Math.abs(income.amount).toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm">{income.walletName}</p>
                    </div>
                  </Link>
                  <div className="flex justify-end divide-x min-w-36">
                    <Link to={`/income/update/${income._id}`}>
                      <button className="text-indigo-600 px-2">Update</button>
                    </Link>
                    <button
                      className="text-red-600 px-2"
                      onClick={() => setShowModal(income._id)}
                    >
                      Delete
                    </button>
                    {showModal === income._id && (
                      <ModalPopUp
                        heading={`Delete ${income.description}`}
                        description="Are you sure you want to delete this income? This action cannot be undone."
                        onClick={() => {
                          handleDelete(income._id);
                        }}
                        onClick2={() => setShowModal(null)}
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

export default IncomePage;
