import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/InputField";

const UpdateWallet = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch data kategori berdasarkan ID
    const fetchWallet = async () => {
      try {
        const response = await fetch(`http://localhost:5000/wallet/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name,
            type: data.type,
            balance: data.balance,
          });
        } else {
          console.error("Failed to fetch wallet");
        }
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    };

    fetchWallet();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/wallet/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setMessage("Wallet updated successfully!");
        setMessageType("success");
        setTimeout(() => {
          navigate("/wallets");
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      setMessage("Failed to update wallet. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 mr-6 ml-80">
      <h1 className="text-2xl font-bold">Wallets</h1>
      <div className="bg-white rounded-lg shadow-lg flex flex-col divide-y mt-8 py-4 px-6">
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Name
            </label>
            <div className="mt-2">
              <InputField
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter wallet name"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="type"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Type
            </label>
            <div className="mt-2">
              <InputField
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Enter wallet type"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="balance"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Balance
            </label>
            <div className="mt-2">
              <InputField
                type="number"
                id="balance"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                placeholder="Enter wallet balance"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-md bg-teal-600 px-3 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            {loading ? "Loading..." : "Create Wallet"}
          </button>
        </form>
        {message && (
          <div
            className={`rounded-md p-4 mt-4 ${
              messageType === "success" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div className="flex">
              <div className="shrink-0	">
                {messageType === "success" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="text-green-400 size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                )}
                {messageType === "error" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="text-red-500 size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3
                  className={`text-sm font-medium ${
                    messageType === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {message}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateWallet;
