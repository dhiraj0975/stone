import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../redux/product/productThunks";
import { clearProductState } from "../../redux/product/productSlice";
import { fetchCategories } from "../../redux/categorys/categoriesThunks";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const Product = () => {
  const dispatch = useDispatch();
  const { list, loading, error, success } = useSelector(state => state.product);
  const { items: categories } = useSelector(state => state.categories);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    product_name: "", category_id: "", mrp: "", purchase_rate: "",
    sales_rate: "", qty: "", min_qty: "", remark: "", weight_per_packet: "", status: "Active"
  });

  useEffect(() => {
    dispatch(getProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) setOpen(false);
    const timer = setTimeout(() => dispatch(clearProductState()), 3000);
    return () => clearTimeout(timer);
  }, [success, dispatch]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const openForm = (prod = null) => {
    if (prod) {
      setEditId(prod.id);
      setForm({
        product_name: prod.product_name || "",
        category_id: prod.category_id || "",
        mrp: prod.mrp || "",
        purchase_rate: prod.purchase_rate || "",
        sales_rate: prod.sales_rate || "",
        qty: prod.qty || "",
        min_qty: prod.min_qty || "",
        remark: prod.remark || "",
        weight_per_packet: prod.weight_per_packet || "",
        status: prod.status || "Active",
      });
    } else {
      setEditId(null);
      setForm({
        product_name: "", category_id: "", mrp: "", purchase_rate: "",
        sales_rate: "", qty: "", min_qty: "", remark: "", weight_per_packet: "", status: "Active"
      });
    }
    setOpen(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      ...form,
      mrp: parseFloat(form.mrp),
      purchase_rate: parseFloat(form.purchase_rate),
      sales_rate: parseFloat(form.sales_rate),
      qty: parseInt(form.qty, 10),
      min_qty: parseInt(form.min_qty, 10)
    };
    if (editId) dispatch(updateProduct({ id: editId, data })).then(() => toast.success("Product updated successfully!"));
    else dispatch(createProduct(data)).then(() => toast.success("Product added successfully!"));
  };

  const handleDelete = id => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => toast.success("Product deleted successfully!"))
        .catch(err => toast.error(err));
    }
  };

  const getCategoryName = id => {
    const cat = categories.find(c => c.id === id || c._id === id);
    return cat ? cat.name : "Unknown";
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-6">
      <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8 tracking-wide">Product Dashboard</h1>

      {/* Add Product Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          <FiPlus size={18} /> Add Product
        </button>
      </div>

      {/* Modal Form */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 animate-slide-down">
            <h2 className="text-2xl font-semibold mb-5 text-gray-700">{editId ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                name="product_name"
                value={form.product_name}
                onChange={handleChange}
                required
                className="border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>)}
              </select>
              {["mrp","purchase_rate","sales_rate","qty","min_qty","weight_per_packet"].map(f => (
                <input
                  key={f}
                  type={["mrp","purchase_rate","sales_rate","qty","min_qty"].includes(f) ? "number" : "text"}
                  placeholder={f.replace("_"," ").toUpperCase()}
                  name={f}
                  value={form[f]}
                  onChange={handleChange}
                  required={["mrp","purchase_rate","sales_rate","qty"].includes(f)}
                  className="border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              ))}
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <textarea
                placeholder="Remark"
                name="remark"
                value={form.remark}
                onChange={handleChange}
                rows={3}
                className="border-gray-300 border rounded-lg px-4 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="col-span-2 flex justify-end gap-3 mt-3">
                <button type="button" onClick={() => setOpen(false)} className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">{editId ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl mt-6">
        <table className="min-w-full  bg-white divide-y divide-gray-200 rounded-xl">
          <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
            <tr>
              {["Product Name","Category","MRP","Purchase Rate","Sales Rate","Qty","Min Qty","Remark","Weight/Packet","Status","Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.length > 0 ? list.map(prod => (
              <tr key={prod.id} className="hover:bg-indigo-50 transition">
                
                <td className="px-4 py-2 font-medium">{prod.product_name}</td>
                <td className="px-4 py-2">{getCategoryName(prod.category_id)}</td>
                <td className="px-4 py-2">{prod.mrp}</td>
                <td className="px-4 py-2">{prod.purchase_rate}</td>
                <td className="px-4 py-2">{prod.sales_rate}</td>
                <td className="px-4 py-2">{prod.qty}</td>
                <td className="px-4 py-2">{prod.min_qty}</td>
                <td className="px-4 py-2">{prod.remark}</td>
                <td className="px-4 py-2">{prod.weight_per_packet}</td>
                <td className="px-4 py-2">{prod.status}</td>
                <td className="px-4 py-2 flex gap-3">
                  <button onClick={() => openForm(prod)} className="text-indigo-600 hover:text-indigo-800"><FiEdit /></button>
                  <button onClick={() => handleDelete(prod.id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="11" className="text-center py-6 text-gray-400">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
