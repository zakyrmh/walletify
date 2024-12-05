import { useState, useEffect } from "react";

const CreateExpense = () => {
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    datetime: "",
    walletId: "",
    details: [
      {
        description: "",
        cost: "",
        quantity: "",
        categoryId: "",
      },
    ],
    recordAsExpense: true,
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

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
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        recordAsExpense: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetails = [...formData.details];
    updatedDetails[index][name] = value;
    setFormData((prev) => ({ ...prev, details: updatedDetails }));
  };

  const addDetail = () => {
    setFormData((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        { description: "", cost: "", quantity: "", categoryId: "" },
      ],
    }));
  };

  const removeDetail = (index) => {
    const updatedDetails = [...formData.details];
    updatedDetails.splice(index, 1);
    setFormData((prev) => ({ ...prev, details: updatedDetails }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        details: formData.details.map((item) => ({
          ...item,
          cost: parseFloat(item.cost) || 0, // Ensure valid number
          quantity: parseInt(item.quantity, 10) || 0, // Ensure valid number
          amount: parseFloat(item.cost) * parseInt(item.quantity, 10),
        })),
      };

      const response = await fetch("http://localhost:5000/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        setMessage("Expense created successfully!");
        setMessageType("success");
        setFormData({
          description: "",
          datetime: "",
          walletId: "",
          details: [],
          recordAsExpense: false, // Reset checkbox to false
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
      <h1 className="text-2xl font-bold">Add Expense</h1>
      <div className="bg-slate-700/20 rounded-xl shadow-xl mt-4 p-4 w-4/5">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="space-y-4 w-1/2">
            <div>
              <label
                htmlFor="description"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Description
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
            <div>
              <label
                htmlFor="datetime"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Datetime
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
            <div>
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
            <div className="flex gap-3">
              <div className="flex h-6 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    id="recordAsExpense"
                    name="recordAsExpense"
                    type="checkbox"
                    checked={formData.recordAsExpense}
                    onChange={handleChange}
                    className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100"
                  />
                  <svg
                    className={`pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white ${
                      formData.recordAsExpense ? "opacity-100" : "opacity-0"
                    }`}
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-sm/6">
                <label
                  htmlFor="recordAsExpense"
                  className="font-medium text-gray-900"
                >
                  Record as Expense
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
          <div className="w-1/2">
            {formData.details.map((detail, index) => (
              <div key={index} className="space-y-4 mb-4">
                <div>
                  <label
                    htmlFor={`description-${index}`}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Detail Description
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id={`description-${index}`}
                      name="description"
                      value={detail.description}
                      onChange={(e) => handleDetailsChange(index, e)}
                      required
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor={`cost-${index}`}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Cost
                  </label>
                  <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                    <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
                      Rp
                    </div>
                    <input
                      type="number"
                      id={`cost-${index}`}
                      name="cost"
                      value={detail.cost}
                      onChange={(e) => handleDetailsChange(index, e)}
                      required
                      className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor={`quantity-${index}`}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Quantity
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      id={`quantity-${index}`}
                      name="quantity"
                      value={detail.quantity}
                      onChange={(e) => handleDetailsChange(index, e)}
                      required
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor={`categoryId-${index}`}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Category
                  </label>
                  <div className="mt-2">
                    <select
                      id={`categoryId-${index}`}
                      name="categoryId"
                      value={detail.categoryId}
                      onChange={(e) => handleDetailsChange(index, e)}
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
                {formData.details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetail(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addDetail} className="text-blue-500">
              Add Detail
            </button>
          </div>
        </form>
        {message && (
          <p
            className={
              messageType === "success" ? "text-green-500" : "text-red-500"
            }
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateExpense;
