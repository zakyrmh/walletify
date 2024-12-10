import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWallets } from "../../API/fetchWallets";
import InputField from "../../components/InputField";
import Alert from "../../components/Alert";

const CreateTransfer = () => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    datetime: "",
    senderWalletId: "",
    receiverWalletId: "",
  });
  const [wallets, setWallets] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset pesan dan set loading ke true
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/transfer/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        setSuccess("Transfer created successfully!");
        setFormData({ name: "" });

        setTimeout(() => {
          navigate("/transfers");
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error creating transfer:", error);
      setError("Failed to create transfer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 mr-6 ml-80">
      <h1 className="text-2xl font-bold">Create Transfer</h1>
      <div className="bg-white rounded-lg shadow-lg flex flex-col divide-y mt-8 py-4 px-6">
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label
              htmlFor="description"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Description
            </label>
            <div className="mt-2">
              <InputField
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="amount"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Amount
            </label>
            <div className="mt-2">
              <InputField
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="datetime"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Datetime
            </label>
            <div className="mt-2">
              <InputField
                type="datetime-local"
                id="datetime"
                name="datetime"
                value={formData.datetime}
                onChange={handleChange}
                placeholder="Enter datetime"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="senderWalletId"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Sender Wallet
            </label>
            <div className="mt-2">
              <select
                name="senderWalletId"
                value={formData.senderWalletId}
                onChange={handleChange}
                required
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="" disabled>
                  -- Select Wallet --
                </option>
                {wallets.map((wallet) => (
                  <option key={wallet._id} value={wallet._id}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="receiverWalletId"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Receiver Wallet
            </label>
            <div className="mt-2">
              <select
                name="receiverWalletId"
                value={formData.receiverWalletId}
                onChange={handleChange}
                required
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="" disabled>
                  -- Select Wallet --
                </option>
                {wallets.map((wallet) => (
                  <option key={wallet._id} value={wallet._id}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="rounded-md bg-teal-600 px-3 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            {loading ? "Loading..." : "Create Transfer"}
          </button>
        </form>
        {success && <Alert message={success} type="success" />}
        {error && <Alert message={error} type="error" />}
      </div>
    </div>
  );
};

export default CreateTransfer;
