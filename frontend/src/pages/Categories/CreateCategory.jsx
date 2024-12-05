import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";

const CreateCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:5000/category/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Jika response berhasil
      if (response.ok) {
        setMessage("Category created successfully!");
        setMessageType("success");
        setFormData({ name: "" });

        // Redirect setelah beberapa detik
        setTimeout(() => {
          navigate("/categories");
        }, 2000);
      } else {
        // Tangkap error dari response
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || "Something went wrong"}`);
        setMessageType("error");
      }
    } catch (error) {
      // Tangkap error dari fetch
      console.error("Error creating category:", error);
      setMessage("Failed to create category. Please try again.");
      setMessageType("error");
    } finally {
      // Pastikan loading dihentikan di akhir
      setLoading(false);
    }
  };

  return (
    <div className="my-8 mr-6 ml-80">
      <h1 className="text-2xl font-bold">Categories</h1>
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
                placeholder="Enter category name"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-md bg-teal-600 px-3 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            {loading ? "Loading..." : "Create Category"}
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

export default CreateCategory;
