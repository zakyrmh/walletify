export const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/categories");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchCategory = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/category/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error.message);
  }
};
