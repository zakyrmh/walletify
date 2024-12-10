import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWallet } from "../../API/fetchWallets";
import InputField from "../../components/InputField";
import Alert from "../../components/Alert";

const UpdateWallet = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getWallet = async () => {
      try {
        const data = await fetchWallet(id);
        setFormData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getWallet();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/wallet/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSuccess("Wallet updated successfully!");
        setTimeout(() => {
          navigate("/wallets");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      setError("Failed to update wallet. Please try again.");
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
        {success && <Alert message={success} type="success" />}
        {error && <Alert message={error} type="error" />}
      </div>
    </div>
  );
};

export default UpdateWallet;
