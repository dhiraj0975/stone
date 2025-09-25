import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerAPI from "../../axios/CustomersAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerRegistration = ({ onSuccess }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Auto-fill if editing
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const fetchCustomer = async () => {
        try {
          const res = await CustomerAPI.getById(id);
          setForm(res.data);
        } catch (err) {
          console.error(err);
          toast.error("❌ Failed to load customer details");
        }
      };
      fetchCustomer();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("⚠️ Name is required!");
      return;
    }
    try {
      setLoading(true);

      if (isEdit) {
        await CustomerAPI.update(id, form);
        toast.success("✅ Customer updated successfully!");
      } else {
        await CustomerAPI.create(form);
        toast.success("✅ Customer registered successfully!");
        setForm({ name: "", email: "", phone: "", address: "" });
      }

      if (onSuccess) onSuccess();

      // Redirect to customer list
      navigate("/customers");
    } catch (err) {
      console.error(err);
      toast.error("❌ Operation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded w-full max-w-md">
      <h2 className="text-lg font-bold mb-2">
        {isEdit ? "Edit Customer" : "Customer Registration"}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border p-1 mb-2 w-full rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-1 mb-2 w-full rounded"
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="border p-1 mb-2 w-full rounded"
      />
      <textarea
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        className="border p-1 mb-2 w-full rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 active:scale-95 rounded ${isEdit ? "bg-blue-600" : "bg-green-700"} text-white ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Saving..." : isEdit ? "Update Customer" : "Register Customer"}
      </button>
    </form>
  );
};

export default CustomerRegistration;
