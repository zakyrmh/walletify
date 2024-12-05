import { useState, useEffect } from "react";

const Dompet = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/wallets")
      .then((response) => response.json())
      .then((data) => {
        setWallets(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="flex flex-col gap-3">
        <h1 className="text-lg font-semibold">Wallets</h1>
        {wallets.map((wallet) => (
          <div key={wallet._id} className="bg-white rounded-lg py-2 px-3 ">
            <h2>{wallet.name}</h2>
            <p className="text-sm font-medium">Rp{wallet.balance}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dompet;
