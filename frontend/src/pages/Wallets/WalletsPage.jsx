import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ErrorPage from "../../components/ErrorPage";

const WalletsPage = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/wallets")
      .then((response) => response.json())
      .then((data) => {
        setWallets(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this wallet?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/wallet/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.message}`);
        return;
      }

      // Update categories state
      setWallets(wallets.filter((wallet) => wallet._id !== id));
      alert("Wallet deleted successfully!");
    } catch (error) {
      console.error("Error deleting wallet:", error);
      alert("Failed to delete wallet. Please try again.");
    }
  };

  if (error) return <ErrorPage pageName="Wallets" error={error} />;

  return (
    <>
      <div className="my-8 mr-6 ml-80">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Wallets</h1>
          <Link to="/wallet/create">
            <button className="rounded-md bg-[#299D91] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Add
            </button>
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <span className="loader"></span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-8">
            {wallets.map((wallet) => (
              <div
                key={wallet._id}
                className="bg-white flex justify-between rounded-lg shadow-lg items-center py-4 px-6"
              >
                <div>
                  <p className="text-sm">{wallet.type}</p>
                  <p className="text-lg font-semibold">{wallet.name}</p>
                </div>
                <div className="flex justify-end items-center gap-6">
                  <p className="text-lg font-semibold">
                    Rp{wallet.balance.toLocaleString("id-ID")}
                  </p>
                  <div className="divide-x">
                    <Link to={`/wallet/update/${wallet._id}`}>
                      <button className="text-indigo-600 px-2">Update</button>
                    </Link>
                    <button
                      className="text-red-600 px-2"
                      onClick={() => handleDelete(wallet._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WalletsPage;
