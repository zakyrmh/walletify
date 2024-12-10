export const fetchTransfers = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/transfers");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchTransfer = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/transfer/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
};
