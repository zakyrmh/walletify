import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchIncome } from "../../API/fetchIncomes";
import { fetchCategories } from "../../API/fetchCategories";
import { fetchWallets } from "../../API/fetchWallets";
import InputField from "../../components/InputField";
import Alert from "../../components/Alert";

const UpdateIncome = () => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    datetime: "",
    walletId: "",
    categoryId: "",
  });
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const formatDatetime = (datetime) => {
    const date = new Date(datetime);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
  };

  useEffect(() => {
    const getIncome = async () => {
      try {
        const data = await fetchIncome(id);
        setFormData({
          ...data,
          datetime: formatDatetime(data.datetime),
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getIncome();
  }, [id]);

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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/income/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSuccess("Income updated successfully!");
        setTimeout(() => {
          navigate("/incomes");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating income:", error);
      setError("Failed to update income. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 mr-6 ml-80">
      <h1 className="text-2xl font-bold">Update Income</h1>
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
            {loading ? "Loading..." : "Create Category"}
          </button>
        </form>
        {success && <Alert message={success} type="success" />}
        {error && <Alert message={error} type="error" />}
      </div>
    </div>
  );
};

export default UpdateIncome;
