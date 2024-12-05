import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateExpense = () => {
  const { id } = useParams(); // ID dari URL
  const navigate = useNavigate();

  // State untuk expense
  const [expense, setExpense] = useState({
    description: "",
    datetime: "",
    walletId: "",
    details: [], // Berisi array detail yang akan dikelola
    recordAsExpense: "",
  });

  const [wallets, setWallets] = useState([]); // Data dompet
  const [categories, setCategories] = useState([]); // Data kategori
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mendapatkan data expense dari server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data expense
        const expenseRes = await fetch(`http://localhost:5000/expenses/${id}`);
        const expenseData = await expenseRes.json();

        // Ambil data wallets dan categories
        const [walletRes, categoryRes] = await Promise.all([
          fetch("http://localhost:5000/wallets"),
          fetch("http://localhost:5000/categories"),
        ]);
        const walletsData = await walletRes.json();
        const categoriesData = await categoryRes.json();

        setExpense(expenseData);
        setWallets(walletsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Fungsi untuk menangani perubahan input utama
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk menangani perubahan input detail
  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetails = [...expense.details];
    updatedDetails[index][name] = value;
    setExpense((prev) => ({ ...prev, details: updatedDetails }));
  };

  // Tambahkan detail baru
  const addDetail = () => {
    setExpense((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        { description: "", cost: "", quantity: "", categoryId: "" },
      ],
    }));
  };

  // Hapus detail berdasarkan index
  const removeDetail = (index) => {
    setExpense((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  // Fungsi untuk submit data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense), // Kirim seluruh data expense termasuk details
      });

      if (!response.ok) throw new Error("Failed to update expense.");
      navigate("/expenses");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-4 mx-6">
      <h1 className="text-2xl font-bold mb-4">Update Expense</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input untuk deskripsi */}
        <div>
          <label className="block font-semibold">Description</label>
          <input
            type="text"
            name="description"
            value={expense.description || ""}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Input untuk datetime */}
        <div>
          <label className="block font-semibold">Datetime</label>
          <input
            type="datetime-local"
            name="datetime"
            value={expense.datetime || ""}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Input untuk wallet */}
        <div>
          <label className="block font-semibold">Wallet</label>
          <select
            name="walletId"
            value={expense.walletId || ""}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Wallet</option>
            {wallets.map((wallet) => (
              <option key={wallet._id} value={wallet._id}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input untuk record as expense */}
        <div>
          <label className="block font-semibold">Record as Expense</label>
          <select
            name="recordAsExpense"
            value={expense.recordAsExpense || ""}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Option</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Bagian untuk mengelola details */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          {expense.details.map((detail, index) => (
            <div key={index} className="space-y-2 border-b pb-4 mb-4">
              {/* Input detail description */}
              <div>
                <label className="block font-semibold">Description</label>
                <input
                  type="text"
                  name="description"
                  value={detail.description || ""}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              {/* Input detail cost */}
              <div>
                <label className="block font-semibold">Cost</label>
                <input
                  type="number"
                  name="cost"
                  value={detail.cost || ""}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              {/* Input detail quantity */}
              <div>
                <label className="block font-semibold">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={detail.quantity || ""}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              {/* Input detail category */}
              <div>
                <label className="block font-semibold">Category</label>
                <select
                  name="categoryId"
                  value={detail.categoryId || ""}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Tombol hapus detail */}
              <button
                type="button"
                onClick={() => removeDetail(index)}
                className="text-red-500 font-semibold mt-2"
              >
                Remove Detail
              </button>
            </div>
          ))}
          {/* Tombol tambah detail */}
          <button
            type="button"
            onClick={addDetail}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Detail
          </button>
        </div>

        {/* Tombol submit */}
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded font-semibold"
        >
          Update Expense
        </button>
      </form>
    </div>
  );
};

export default UpdateExpense;
