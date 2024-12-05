import { useEffect, useState } from "react";
import axios from "axios";

const TotalBalance = () => {
  const [wallets, setWallets] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Untuk melacak halaman slider
  const walletsPerPage = 1; // Menampilkan satu wallet per halaman

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/wallets");
        setWallets(response.data);
        calculateTotalBalance(response.data);
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };

    fetchWallets();
  }, []);

  const calculateTotalBalance = (wallets) => {
    const total = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);
    setTotalBalance(total);
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(wallets.length / walletsPerPage) - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Mendapatkan data wallet berdasarkan halaman saat ini
  const currentWallets = wallets.slice(
    currentPage * walletsPerPage,
    currentPage * walletsPerPage + walletsPerPage
  );

  return (
    <div className="w-full">
      <h2 className="text-[#878787] text-lg">Total Balance</h2>
      <div className="bg-white rounded-lg shadow-lg px-6 py-5 mt-2">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold border-b-2 pb-3">
            Rp{totalBalance.toLocaleString("id-ID")}
          </p>
          <p className="text-[#525256] text-sm pb-3">All Accounts</p>
        </div>
        <div>
          {currentWallets.map((wallet) => (
            <div
              key={wallet._id}
              className="bg-[#299D91] flex justify-between items-center rounded-lg mt-3 p-4"
            >
              <div>
                <p className="text-white text-sm">{wallet.type}</p>
                <p className="text-white text-lg font-semibold">
                  {wallet.name}
                </p>
              </div>
              <div>
                <p className="text-white text-lg font-semibold">
                  Rp{wallet.balance.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center gap-x-3 mt-5">
          <button
            className="flex items-center gap-2 text-sm mx-auto w-[73px]"
            onClick={handlePrevious}
            disabled={currentPage === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            <span>Previous</span>
          </button>
          <div className="flex gap-2">
            {Array.from(
              { length: Math.ceil(wallets.length / walletsPerPage) },
              (_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentPage ? "bg-[#299D91]" : "bg-[#D1D1D1]"
                  }`}
                ></span>
              )
            )}
          </div>
          <button
            className="flex items-center gap-2 text-sm mx-auto w-[73px]"
            onClick={handleNext}
            disabled={
              currentPage === Math.ceil(wallets.length / walletsPerPage) - 1
            }
          >
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TotalBalance;
