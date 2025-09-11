import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createVendor, getVendors, deleteVendor, updateVendor } from "../../redux/vender/vendorThunks";

export default function VendorPage() {
  const dispatch = useDispatch();
  const { vendors, loading, error } = useSelector((state) => state.vendor);

  const [formData, setFormData] = useState({
    name: "",
    mobile_no: "",
    firm_name: "",
    gst: "",
    balance: "",
    status: "",
    email: "",
  });

  const [formError, setFormError] = useState("");
  const [editId, setEditId] = useState(null); // ✅ track edit

  useEffect(() => {
    dispatch(getVendors());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile_no || !formData.firm_name) {
      setFormError("⚠️ Name, Mobile No, and Firm Name are required!");
      return;
    }

    setFormError("");

    try {
      if (editId) {
        await dispatch(updateVendor({ id: editId, ...formData }));
        setEditId(null);
      } else {
        await dispatch(createVendor(formData));
      }
      await dispatch(getVendors());
    } catch (_) {}

    setFormData({
      name: "",
      mobile_no: "",
      firm_name: "",
      gst: "",
      balance: "",
      status: "",
      email: "",
    });
  };

  const handleEdit = (vendor) => {
    setFormData({
      name: vendor.name,
      mobile_no: vendor.mobile_no,
      firm_name: vendor.firm_name,
      gst: vendor.gst,
      balance: vendor.balance,
      status: vendor.status,
      email: vendor.email,
    });
    setEditId(vendor._id || vendor.id);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Vendor Master</h2>

      {formError && (
        <div className="bg-red-100 text-red-600 p-2 mb-3 rounded">
          {formError}
        </div>
      )}

      {/* ✅ Vendor Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mobile No"
          className="border p-2 rounded"
          value={formData.mobile_no}
          onChange={(e) =>
            setFormData({ ...formData, mobile_no: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Firm Name"
          className="border p-2 rounded"
          value={formData.firm_name}
          onChange={(e) =>
            setFormData({ ...formData, firm_name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="GST"
          className="border p-2 rounded"
          value={formData.gst}
          onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
        />
        <input
          type="number"
          placeholder="Balance"
          className="border p-2 rounded"
          value={formData.balance}
          onChange={(e) =>
            setFormData({ ...formData, balance: e.target.value })
          }
        />
        <select
          className="border p-2 rounded"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <button
          type="submit"
          className={`${
            editId ? "bg-green-600" : "bg-blue-600"
          } text-white px-4 py-2 rounded md:col-span-2`}
        >
          {editId ? "Update Vendor" : "Add Vendor"}
        </button>
      </form>

      {/* ✅ Vendor List */}
      {loading ? (
        <p>Loading vendors...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Mobile No</th>
              <th className="p-2 border">Firm Name</th>
              <th className="p-2 border">GST</th>
              <th className="p-2 border">Balance</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id || vendor.id}>
                <td className="p-2 border">{vendor.name || "-"}</td>
                <td className="p-2 border">{vendor.mobile_no || "-"}</td>
                <td className="p-2 border">{vendor.firm_name || "-"}</td>
                <td className="p-2 border">{vendor.gst || "-"}</td>
                <td className="p-2 border">{vendor.balance ?? "-"}</td>
                <td className="p-2 border">{vendor.status || "-"}</td>
                <td className="p-2 border">{vendor.email || "-"}</td>
                <td className="p-2 border">
                  {vendor.created_at
                    ? new Date(vendor.created_at).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => handleEdit(vendor)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => dispatch(deleteVendor(vendor._id || vendor.id))}
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

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
}
