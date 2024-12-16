import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWallets } from "../../API/fetchWallets";
import ErrorPage from "../../components/ErrorPage";
import ModalPopUp from "../../components/ModalPopUp";

const WalletsPage = () => {
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wallet/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.message}`);
        return;
      }

      setWallets(wallets.filter((wallet) => wallet._id !== id));

      setTimeout(() => {
        setShowModal(null);
        navigate("/wallets");
      }, 1000);
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
                      onClick={() => setShowModal(wallet._id)}
                    >
                      Delete
                    </button>
                    {showModal === wallet._id && (
                      <ModalPopUp
                        heading={`Delete ${wallet.name}`}
                        description="Are you sure you want to delete this wallet? This action cannot be undone."
                        onClick={() => {
                          handleDelete(wallet._id);
                        }}
                        onClick2={() => setShowModal(null)}
                      />
                    )}
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
