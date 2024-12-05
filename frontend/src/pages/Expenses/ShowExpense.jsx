import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const ShowExpense = () => {
  const { id } = useParams(); // Mendapatkan ID dari URL
  const [expense, setExpense] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data wallets
  const fetchWallets = async () => {
    try {
      const response = await fetch("http://localhost:5000/wallets");
      const data = await response.json();
      setWallets(data);
    } catch (err) {
      console.error("Error fetching wallets:", err);
    }
  };

  // Fungsi untuk mengambil data expense
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(`http://localhost:5000/expenses/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch expense data.");
        }
        const data = await response.json();
        setExpense(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWallets();
    fetchExpense();
  }, [id]);

  // Fungsi untuk mendapatkan nama wallet berdasarkan walletId
  const getWalletName = (walletId) => {
    const wallet = wallets.find((w) => w._id === walletId);
    return wallet ? wallet.name : "Wallet not found";
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-4 mr-6 ml-80">
      <h1 className="text-2xl font-bold">Expense</h1>
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
              </div>
              <div className="text-right">
                <p>{getWalletName(expense.walletId)}</p>
                <p>
                  {new Date(expense.datetime)
                    .toLocaleString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .replace(".", ":")}
                </p>
                <p>
                  {new Date(expense.datetime)
                    .toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                    .replace(".", ":")}
                </p>
              </div>
            </div>
          </div>
        )}
        {expense?.detailId && (
          <div className="space-y-4 mt-6">
            {expense.detailId.items.map((item) => (
              <div
                key={item._id}
                className="bg-white flex justify-between items-center rounded-lg shadow-lg py-2 px-3"
              >
                <div className="w-1/2">
                  <p className="font-semibold">{item.description}</p>
                  <p className="text-sm">{item.quantity} pcs</p>
                </div>
                <div>
                  <p className="text-sm">
                    Rp{Math.abs(item.cost).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">
                    Rp{Math.abs(item.amount).toLocaleString("id-ID")}
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
    </div>
  );
};

export default ShowExpense;
