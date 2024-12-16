export const fetchExpenses = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/expenses");
    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

export const fetchExpense = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/expense/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchCreateExpense = async (formData) => {
  try {
    const response = await fetch("http://localhost:5000/api/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create expense");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting form", error);
    throw error;
  }
};

export const fetchUpdateExpense = async (id, formData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/expense/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update expense");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

export const fetchExpenseDetail = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/expense-details/${id}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
};
