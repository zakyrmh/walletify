import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWallets } from "../../API/fetchWallets";
import { fetchTransfers } from "../../API/fetchTransfers";
import ErrorPage from "../../components/ErrorPage";
import ModalPopUp from "../../components/ModalPopUp";
import SuccessPopUp from "../../components/SuccessPopUp";

const TransfersPage = () => {
  const [groupedTransfers, setGroupedTransfers] = useState({});
  const [transfers, setTransfers] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

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

  const getSenderWalletName = useCallback(
    (senderWalletId) => {
      const wallet = wallets.find((w) => w._id === senderWalletId);
      return wallet ? wallet.name : "Unknown Wallet";
    },
    [wallets]
  );

  const getReceiverWalletName = useCallback(
    (receiverWalletId) => {
      const wallet = wallets.find((w) => w._id === receiverWalletId);
      return wallet ? wallet.name : "Unknown Wallet";
    },
    [wallets]
  );

  const groupByDate = useCallback((transfers) => {
    return transfers.reduce((grouped, transfer) => {
      const date = new Date(transfer.datetime).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transfer);
      return grouped;
    }, {});
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const transfers = await fetchTransfers();
        const updatedData = transfers.map((transfer) => ({
          ...transfer,
          senderWalletName: getSenderWalletName(transfer.senderWalletId),
          receiverWalletName: getReceiverWalletName(transfer.receiverWalletId),
        }));

        const grouped = groupByDate(updatedData);
        setGroupedTransfers(grouped);
        setTransfers(transfers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [getSenderWalletName, getReceiverWalletName, groupByDate]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/transfer/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.message}`);
        return;
      }

      setTransfers(transfers.filter((transfer) => transfer._id !== id));
      setGroupedTransfers((prevGrouped) => {
        const updatedGrouped = { ...prevGrouped };
        for (const date in updatedGrouped) {
          updatedGrouped[date] = updatedGrouped[date].filter(
            (transfer) => transfer._id !== id
          );
        }
        return updatedGrouped;
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/transfers");
      }, 1000);
    } catch (error) {
      console.error("Error deleting transfer:", error);
      alert("Failed to delete transfer. Please try again.");
    }
  };

  if (error) return <ErrorPage pageName="Transfers" error={error} />;

  return (
    <div className="my-8 mr-6 ml-80">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transfers</h1>
        <Link to="/transfer/create">
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
          {Object.entries(groupedTransfers).map(([date, transfers]) => (
            <div
              key={date}
              className="bg-slate-700/20 flex flex-col gap-3 rounded-xl shadow-xl w-auto p-4 mt-8"
            >
              <div className="flex justify-between item-center">
                <h2 className="text-lg font-semibold">{date}</h2>
                <p className="text-lg font-semibold">
                  Rp
                  {transfers
                    .reduce((amount, transfer) => amount + transfer.amount, 0)
                    .toLocaleString("id-ID")}
                </p>
              </div>
              {transfers.map((transfer) => (
                <div
                  key={transfer._id}
                  className="bg-white flex items-center justify-between rounded-lg shadow-lg py-2 px-3"
                >
                  <div>
                    <h2>{transfer.description}</h2>
                    <p className="text-sm">
                      {new Date(transfer.datetime).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      Rp{transfer.amount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm">
                      {transfer.senderWalletName} -{" "}
                      {transfer.receiverWalletName}
                    </p>
                  </div>
                  <div className="divide-x">
                    <Link to={`/transfer/update/${transfer._id}`}>
                      <button className="text-indigo-600 px-2">Update</button>
                    </Link>
                    <button
                      className="text-red-600 px-2"
                      onClick={() => {
                        setSelectedTransfer(transfer);
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {showModal && selectedTransfer && (
            <ModalPopUp
              heading={`Delete ${selectedTransfer.description}`}
              description="Are you sure you want to delete this transfer? This action cannot be undone."
              onClick={() => {
                handleDelete(selectedTransfer._id);
                setShowModal(false);
                setSelectedTransfer(null);
              }}
              onClick2={() => {
                setShowModal(false);
                setSelectedTransfer(null);
              }}
            />
          )}
          {showSuccess && (
            <SuccessPopUp
              heading="Delete successful!"
              description="The transfer has been deleted successfully."
              onClick={() => setShowSuccess(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TransfersPage;
