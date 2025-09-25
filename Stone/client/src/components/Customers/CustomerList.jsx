import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerAPI from "../../axios/CustomersAPI";
import { toast } from "react-toastify";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await CustomerAPI.getAll();
      setCustomers(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await CustomerAPI.delete(id);
      toast.success("✅ Customer deleted successfully");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete customer");
    }
  };

  // Toggle Active/Inactive status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await CustomerAPI.update(id, { status: newStatus }); // Backend API should support partial update
      toast.success(`✅ Status changed to ${newStatus}`);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update status");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-3">
      <h2 className="text-lg font-bold mb-2">Customer List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="border w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Phone</th>
              <th className="border px-2 py-1">Address</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-2 py-1">{c.id}</td>
                <td className="border px-2 py-1">{c.name}</td>
                <td className="border px-2 py-1">{c.email}</td>
                <td className="border px-2 py-1">{c.phone}</td>
                <td className="border px-2 py-1">{c.address}</td>
                <td className="border px-2 py-1">{c.created_at_formatted}</td>
                <td className="border px-2 py-1 text-center">
  <button
    onClick={() => handleToggleStatus(c.id, c.status === "active" ? "inactive" : "active")}
    className={`px-2 py-1 rounded text-white ${
      c.status === "Active" ? "bg-green-600" : "bg-red-600"
    }`}
  >
    {c.status}
  </button>
</td>

                <td className="border px-2 py-1 space-x-2">
                  {/* Edit button */}
                  <button
                    onClick={() => navigate(`/customers/edit/${c.id}`)}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    Edit
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  >
                    Delete
                  </button>

                  {/* Toggle status */}
                  <button
                    onClick={() => handleToggleStatus(c.id, c.status)}
                    className="px-2 py-1 bg-gray-600 text-white rounded text-xs"
                  >
                    {c.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerList;
