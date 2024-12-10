import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";

const CreateIncome = () => {
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    datetime: "",
    walletId: "",
    categoryId: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchWallets = async () => {
    try {
      const response = await fetch("http://localhost:5000/wallets");
      const data = await response.json();
      setWallets(data);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchWallets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset pesan dan set loading ke true
    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/income/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Jika response berhasil
      if (response.ok) {
        setMessage("Income created successfully!");
        setMessageType("success");
        setFormData({
          description: "",
          amount: "",
          datetime: "",
          walletId: "",
          categoryId: "",
        });

        // Redirect setelah beberapa detik
        setTimeout(() => {
          navigate("/incomes");
        }, 2000);
      } else {
        // Tangkap error dari response
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || "Something went wrong"}`);
        setMessageType("error");
      }
    } catch (error) {
      // Tangkap error dari fetch
      console.error("Error creating income:", error);
      setMessage("Failed to create income. Please try again.");
      setMessageType("error");
    } finally {
      // Pastikan loading dihentikan di akhir
      setLoading(false);
    }
  };

  return (
    <div className="my-8 mr-6 ml-80">
      <h1 className="text-2xl font-bold">Create Income</h1>
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
              htmlFor="walletId"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Wallet
            </label>
            <div className="mt-2">
              <select
                name="walletId"
                value={formData.walletId}
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
              htmlFor="categoryId"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Category
            </label>
            <div className="mt-2">
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="" disabled>
                  -- Select Category --
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="rounded-md bg-teal-600 px-3 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            {loading ? "Loading..." : "Create Income"}
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

export default CreateIncome;
