import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCategories } from "../../API/fetchCategories";
import ErrorPage from "../../components/ErrorPage";
import ModalPopUp from "../../components/ModalPopUp";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/category/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.message}`);
        return;
      }

      setCategories(categories.filter((category) => category._id !== id));

      setTimeout(() => {
        setShowModal(null);
        navigate("/categories");
      }, 1000);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  if (error) return <ErrorPage pageName="Categories" error={error} />;

  return (
    <>
      <div className="my-8 mr-6 ml-80">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Link to="/category/create">
            <button className="rounded-md bg-teal-600 px-3 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
              Add
            </button>
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <span className="loader"></span>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg flex flex-col divide-y mt-8 py-4 px-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex justify-between items-center py-3"
              >
                <h2>{category.name}</h2>
                <div className="divide-x">
                  <Link to={`/category/update/${category._id}`}>
                    <button className="text-indigo-600 px-2">Update</button>
                  </Link>
                  <button
                    className="text-red-600 px-2"
                    onClick={() => setShowModal(category._id)}
                  >
                    Delete
                  </button>

                  {showModal === category._id && (
                    <ModalPopUp
                      heading={`Delete ${category.name}`}
                      description="Are you sure you want to delete this category? This action cannot be undone."
                      onClick={() => {
                        handleDelete(category._id);
                      }}
                      onClick2={() => setShowModal(null)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoriesPage;
