export const fetchWallets = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/wallets");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchWallet = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/wallet/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
};
