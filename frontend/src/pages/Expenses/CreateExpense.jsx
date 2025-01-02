import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../API/fetchCategories";
import { fetchWallets } from "../../API/fetchWallets";
import InputField from "../../components/InputField";
import ToggleSwitch from "../../components/Toggle";
import Alert from "../../components/Alert";

const CreateExpense = () => {
  const [formData, setFormData] = useState({
    description: "",
    datetime: "",
    walletId: "",
    recordAsExpense: true,
    items: [
      {
        nameItem: "",
        priceItem: 0,
        quantityItem: 0,
        categoryId: "",
      },
    ],
  });

  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, walletsData] = await Promise.all([
          fetchCategories(),
          fetchWallets(),
        ]);
        setCategories(categoriesData);
        setWallets(walletsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index][field] =
        field === "priceItem" || field === "quantityItem"
          ? parseFloat(value) || 0
          : value;
      return { ...prev, items: updatedItems };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { nameItem: "", priceItem: 0, quantityItem: 0, categoryId: "" },
      ],
    }));
  };

  const handleDeleteItem = (index) => {
    setFormData((prev) => {
      const updatedItems = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: updatedItems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      // Kirim data ke API
      const response = await fetch("http://localhost:5000/api/expense/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Expense created successfully!");
        setFormData({
          description: "",
          datetime: "",
          walletId: "",
          recordAsExpense: true,
          items: [
            { nameItem: "", priceItem: 0, quantityItem: 0, categoryId: "" },
          ],
        });
        setTimeout(() => navigate("/expenses"), 1000);
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      setError("Failed to create expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log(formData);

  return (
    <div className="my-8 mr-6 ml-80">
      <h1 className="text-2xl font-bold">Create Expense</h1>
      <div className="bg-white rounded-lg shadow-lg flex flex-col divide-y mt-8 py-4 px-6">
        <form onSubmit={handleSubmit}>
          {/* Description */}
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

          {/* Datetime */}
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
                required
              />
            </div>
          </div>

          {/* Wallet */}
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

          {/* recordAsExpense */}
          <div className="mt-4">
            <label
              htmlFor="recordAsExpense"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Record as Expense
            </label>
            <div className="mt-2">
              <ToggleSwitch
                description="Record as Expense"
                id="recordAsExpense"
                name="recordAsExpense"
                value={formData.recordAsExpense}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Items */}
          <h2 className="text-lg font-semibold mt-6">Items</h2>
          {formData.items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg flex flex-col divide-y mt-8 py-4 px-6"
            >
              <div className="mt-4">
                <label
                  htmlFor="nameItem"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Name Item
                </label>
                <div className="mt-2">
                  <InputField
                    type="text"
                    id="nameItem"
                    name="nameItem"
                    value={item.nameItem}
                    onChange={(e) =>
                      handleItemChange(index, "nameItem", e.target.value)
                    }
                    placeholder="Enter Name Item"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="priceItem"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Price Item
                </label>
                <div className="mt-2">
                  <InputField
                    type="text"
                    id="priceItem"
                    name="priceItem"
                    value={item.priceItem}
                    onChange={(e) =>
                      handleItemChange(index, "priceItem", e.target.value)
                    }
                    placeholder="Enter Price Item"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="quantityItem"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Quantity
                </label>
                <div className="mt-2">
                  <InputField
                    type="text"
                    id="quantityItem"
                    name="quantityItem"
                    value={item.quantityItem}
                    onChange={(e) =>
                      handleItemChange(index, "quantityItem", e.target.value)
                    }
                    placeholder="Enter Quantity"
                    required
                  />
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
                    value={item.categoryId}
                    onChange={(e) =>
                      handleItemChange(index, "categoryId", e.target.value)
                    }
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
                type="button"
                onClick={() => handleDeleteItem(index)}
                className="text-red-600 mt-2 self-end"
              >
                Delete Item
              </button>
            </div>
          ))}

          <div className="flex flex-row-reverse items-center justify-between">
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-4 px-3 py-2 rounded"
            >
              Add Item
            </button>

            {/* Submit */}
            <button
              type="submit"
              className="mt-6 bg-teal-600 text-white px-3 py-2 rounded"
            >
              {loading ? "Loading..." : "Create Expense"}
            </button>
          </div>
        </form>

        {/* Alerts */}
        {success && <Alert message={success} type="success" />}
        {error && <Alert message={error} type="error" />}
      </div>
    </div>
  );
};

export default CreateExpense;
