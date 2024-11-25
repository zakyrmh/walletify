import { useEffect, useState } from "react";
import axios from "axios";

function Wallet() {
  const [wallets, setWallets] = useState([]); // State untuk menyimpan data wallet
  const [loading, setLoading] = useState(true); // State untuk loading data

  // Mengambil data wallets saat komponen pertama kali dimuat
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/wallets") // Ganti dengan URL backend Anda
      .then((response) => {
        setWallets(response.data); // Menyimpan data wallet ke state
        setLoading(false); // Mengubah status loading menjadi false setelah data diterima
      })
      .catch((error) => {
        console.error("Ada kesalahan saat mengambil data wallet:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Daftar Wallets</h1>
      {loading ? (
        <p className="text-center">Loading...</p> // Menampilkan loading jika data belum ada
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Nama Wallet</th>
              <th className="px-4 py-2 border-b">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet._id}>
                <td className="px-4 py-2 border-b">{wallet._id}</td>
                <td className="px-4 py-2 border-b">{wallet.name}</td>
                <td className="px-4 py-2 border-b">{wallet.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Wallet;
