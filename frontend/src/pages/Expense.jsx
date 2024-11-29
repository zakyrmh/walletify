import { useState, useEffect } from "react";

const Expense = () => {
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [details, setDetails] = useState([
    {
      description: "",
      cost: "",
      quantity: "",
      amount: "",
      categoryId: "",
    },
  ]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch wallets
  const fetchWallets = async () => {
    try {
      const response = await fetch("http://localhost:5000/wallets");
      const data = await response.json();
      setWallets(data);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCategories();
    fetchWallets();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await fetch("http://localhost:5000/incomes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setMessage("Income created successfully!");
        setMessageType("success");
        setFormData({
          description: "",
          amount: "",
          walletId: "",
          categoryId: "",
          datetime: "",
        });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Failed to submit form. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="my-4 mr-6 ml-80">
      <h1 className="text-2xl font-bold">Incomes</h1>
      <div className="bg-slate-700/20 rounded-xl shadow-xl mt-4 p-4 w-1/2">
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label
              htmlFor="description"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Deskripsi
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="amount"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Jumlah
            </label>
            <div className="mt-2">
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="walletId"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Dompet
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
              Kategori
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
          <div className="mt-4">
            <label
              htmlFor="datetime"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Waktu
            </label>
            <div className="mt-2">
              <input
                type="datetime-local"
                id="datetime"
                name="datetime"
                value={formData.datetime}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Income
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

export default Expense;
