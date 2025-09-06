import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createVendor } from "../../redux/vender/vendorThunks";

export default function VendorForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    mobile_no: "",
    firm_name: "",
    gst: "",
    balance: 0,
    status: "Active",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createVendor(formData));
    setFormData({
      name: "",
      mobile_no: "",
      firm_name: "",
      gst: "",
      balance: 0,
      status: "Active",
      email: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name"
          className="border p-2 rounded w-full" required />
        <input type="text" name="mobile_no" value={formData.mobile_no} onChange={handleChange} placeholder="Mobile Number"
          className="border p-2 rounded w-full" required />
        <input type="text" name="firm_name" value={formData.firm_name} onChange={handleChange} placeholder="Firm Name"
          className="border p-2 rounded w-full" />
        <input type="text" name="gst" value={formData.gst} onChange={handleChange} placeholder="GST No."
          className="border p-2 rounded w-full" />
        <input type="number" name="balance" value={formData.balance} onChange={handleChange} placeholder="Balance"
          className="border p-2 rounded w-full" />
        <select name="status" value={formData.status} onChange={handleChange}
          className="border p-2 rounded w-full">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"
          className="border p-2 rounded w-full" required />
      </div>
      <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
        Add Vendor
      </button>
    </form>
  );
}