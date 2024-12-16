export const fetchIncomes = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/incomes");
    if (!response.ok) {
      throw new Error("Failed to fetch incomes");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching incomes:", error);
    throw error;
  }
};

export const fetchIncome = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/income/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
};
