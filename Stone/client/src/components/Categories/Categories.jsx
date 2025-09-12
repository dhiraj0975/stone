import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../redux/categorys/categoriesThunks";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Categories() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.categories);

  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSubmit = () => {
    if (!categoryName.trim()) return;

    if (editId) {
      dispatch(updateCategory({ id: editId, name: categoryName }))
        .unwrap()
        .then(() => {
          toast.success("Category updated!");
          setCategoryName("");
          setEditId(null);
        })
        .catch(() => toast.error("Update failed"));
    } else {
      dispatch(addCategory({ name: categoryName }))
        .unwrap()
        .then(() => {
          toast.success("Category added!");
          setCategoryName("");
        })
        .catch(() => toast.error("Add failed"));
    }
  };

const handleEdit = (cat) => {
  setCategoryName(cat.name);
  setEditId(cat.id ); // dono check
};


  const handleDelete = (id) => {
    dispatch(deleteCategory(id))
      .unwrap()
      .then(() => toast.success("Category deleted!"))
      .catch(() => toast.error("Delete failed"));
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = items.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">📂 Category Management</h1>

      <div className="grid grid-cols-3 gap-6">

       {/* Form */}
        <div className=" rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            {editId ? "✏️ Update Category" : "➕ Add New Category"}
          </h2>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="border w-full p-2 rounded mb-3"
          />
          <button
            onClick={handleSubmit}
            className={`w-full ${editId ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded`}
          >
            {editId ? "Update Category" : "Save Category"}
          </button>
        </div>

        

        {/* Table */}
              <div className="col-span-2  rounded-lg p-4 shadow-lg">
                <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">📋 Categories List</h2>
        <span className="text-sm text-gray-600">
          Total Categories: {items.length}
        </span>
      </div>

          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">S/N</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" className="text-center p-4">Loading...</td>
                </tr>
              )}
              {currentItems.length > 0 ? (
                currentItems.map((cat, i) => (
                  <tr key={cat.id} className="hover:bg-gray-50 border">
                    <td className="border px-4 py-2">{indexOfFirst + i + 1}</td>
                    <td className="border px-4 py-2">{cat.name}</td>
                    <td className="border px-4 py-2">
                      {cat.created_at ? new Date(cat.created_at).toLocaleString() : "-"}
                    </td>
                    <td className=" px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                ⬅ Prev
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next ➡
              </button>
            </div>
          )}
        </div>

       
      </div>
    </div>
  );
}
