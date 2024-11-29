import { useState } from "react";
import Dompet from "../components/Dompet";

const Wallets = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/wallets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setMessage("Wallet created successfully!");
        setMessageType("success");
        setFormData({ name: "", type: "" });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      setMessage("Failed to create wallet. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="my-4 mr-6 ml-80">
      <h1 className="text-2xl font-bold">My Wallets</h1>
      <div className="flex justify-center w-full gap-6">
        <div className="bg-slate-700/20 rounded-xl shadow-xl mt-4 p-4 w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Nama
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="type"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Tipe
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
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
              Create Wallet
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
        <div className="bg-slate-700/20 rounded-xl shadow-xl mt-4 w-1/2 p-4">
          <Dompet />
        </div>
      </div>
    </div>
  );
};

export default Wallets;
