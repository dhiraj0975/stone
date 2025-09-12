import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../redux/product/productThunks";

export default function Products() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.product);

  // Local state for form
  const [formData, setFormData] = useState({
    product_name: "",
    category_id: "",
    mrp: "",
    purchase_rate: "",
    sales_rate: "",
    qty: "",
    min_qty: "",
    remark: "",
    weight_per_packet: "",
    status: "Active",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateProduct({ id: editingId, data: formData }));
    } else {
      dispatch(createProduct(formData));
    }
    resetForm();
  };

  // Edit handler
  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
  };

  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      product_name: "",
      category_id: "",
      mrp: "",
      purchase_rate: "",
      sales_rate: "",
      qty: "",
      min_qty: "",
      remark: "",
      weight_per_packet: "",
      status: "Active",
    });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📦 Products</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow mb-6"
      >
        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={formData.product_name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="category_id"
          placeholder="Category ID"
          value={formData.category_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="mrp"
          placeholder="MRP"
          value={formData.mrp}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="purchase_rate"
          placeholder="Purchase Rate"
          value={formData.purchase_rate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="sales_rate"
          placeholder="Sales Rate"
          value={formData.sales_rate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="qty"
          placeholder="Quantity"
          value={formData.qty}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="min_qty"
          placeholder="Min Qty"
          value={formData.min_qty}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="remark"
          placeholder="Remark"
          value={formData.remark}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="weight_per_packet"
          placeholder="Weight/Packet"
          value={formData.weight_per_packet}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">📋 Products List</h2>
        <span className="text-sm text-gray-600">
          Total Products: {list.length}
        </span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">MRP</th>
              <th className="border px-4 py-2">Qty</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p, idx) => (
              <tr key={p.id} className="text-center">
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2">{p.product_name}</td>
                <td className="border px-4 py-2">{p.mrp}</td>
                <td className="border px-4 py-2">{p.qty}</td>
                <td className="border px-4 py-2">{p.status}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
