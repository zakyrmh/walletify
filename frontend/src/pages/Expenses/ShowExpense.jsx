import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchExpense } from "../../API/fetchExpenses";
import { fetchWallets } from "../../API/fetchWallets";
import ErrorPage from "../../components/ErrorPage";

const ShowExpense = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [walletName, setWalletName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateTime = (isoString) => {
    const optionsDate = { day: "numeric", month: "long", year: "numeric" };
    const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: false };

    const dateObj = new Date(isoString);
    const date = dateObj.toLocaleDateString("id-ID", optionsDate);
    const time = dateObj.toLocaleTimeString("id-ID", optionsTime);

    return { date, time };
  };

  useEffect(() => {
    const getExpense = async () => {
      try {
        const expenseData = await fetchExpense(id);

        const { date, time } = formatDateTime(expenseData.datetime);
        const formattedExpense = { ...expenseData, date, time };

        setExpense(formattedExpense);

        const wallets = await fetchWallets();
        const wallet = wallets.find((w) => w._id === expenseData.walletId);
        setWalletName(wallet ? wallet.name : "Unknown Wallet");

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    getExpense();
  }, [id]);

  if (error) return <ErrorPage pageName="Expense" error={error} />;

  return (
    <div className="my-4 mr-6 ml-80">
      <h1 className="text-2xl font-bold">Expense</h1>
      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <span className="loader"></span>
        </div>
      ) : (
        <>
          <div className="bg-slate-700/20 flex flex-col justify-center rounded-xl shadow-xl p-4 w-3/4 mt-6 mx-auto">
            {expense && (
              <div className="text-center">
                <h2 className="text-xl font-semibold">{expense.description}</h2>
                <p className="text-sm font-semibold">
                  Rp{Math.abs(expense.total).toLocaleString("id-ID")}
                </p>
                <div className="flex justify-between mt-4">
                  <div className="text-left">
                    <p>Dompet</p>
                    <p>Waktu</p>
                    <p>Tanggal</p>
                    <p>Record as Expense</p>
                  </div>
                  <div className="text-right">
                    <p>{walletName}</p>
                    <p>{expense.time}</p>
                    <p>{expense.date}</p>
                    <p>{expense.recordAsExpense ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            )}
            {expense?.items && (
              <div className="space-y-4 mt-6">
                {expense.items.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white flex justify-between items-center rounded-lg shadow-lg py-2 px-3"
                  >
                    <div className="w-1/2">
                      <p className="font-semibold">{item.nameItem}</p>
                      <p className="text-sm">{item.quantityItem} pcs</p>
                    </div>
                    <div>
                      <p className="text-sm">
                        Rp{Math.abs(item.priceItem).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">
                        Rp{Math.abs(item.amountItem).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to={`/expense/update/${expense._id}`}>
              <button className="rounded-md bg-indigo-600 w-fit px-3.5 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Update
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ShowExpense;
