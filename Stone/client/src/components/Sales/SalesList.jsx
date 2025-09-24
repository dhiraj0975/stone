import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SalesAPI from "../../axios/salesAPI";
import { fx } from "../../utils/formatter";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await SalesAPI.getAll();
      setSales(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await SalesAPI.delete(id);
      setSales((prev) => prev.filter((s) => s.id !== id));
      alert("Sale deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting sale");
    }
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Sales List</h2>
        <Link
          to="/sales/create"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          + Add Sale
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : sales.length === 0 ? (
        <div className="text-center py-5 text-gray-500">No sales found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm text-center">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Bill No</th>
                <th className="p-2">Date</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Total Taxable</th>
                <th className="p-2">Total GST</th>
                <th className="p-2">Total Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2">{s.id}</td>
                  <td className="p-2">{s.bill_no}</td>
                  <td className="p-2">{s.bill_date}</td>
                  <td className="p-2">{s.customer_name}</td>
                  <td className="p-2">{fx(s.total_taxable)}</td>
                  <td className="p-2">{fx(s.total_gst)}</td>
                  <td className="p-2 font-semibold">{fx(s.total_amount)}</td>
                  <td className="p-2">{s.status}</td>
                  <td className="p-2 flex justify-center gap-1">
                    <Link
                      to={`/sales/edit/${s.id}`}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteSale(s.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/sales/invoice/${s.id}`}
                      className="px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                    >
                      Invoice
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesList;
