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
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await SalesAPI.delete(id);
      setSales((prev) => prev.filter((s) => s.id !== id));
      alert("Sale deleted!");
    } catch (err) {
      console.error(err);
      alert("Error deleting sale");
    }
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Sales List</h2>
        <Link to="/sales/create" className="px-4 py-2 bg-green-600 text-white rounded">
          + Add Sale
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full text-center border text-sm">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th>ID</th>
              <th>Bill No</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id} className="odd:bg-white even:bg-gray-50">
                <td>{s.id}</td>
                <td>{s.bill_no}</td>
                <td>{s.bill_date}</td>
                <td>{s.customer_name}</td>
                <td>{fx(s.total_amount)}</td>
                <td>{s.status}</td>
                <td className="flex gap-2 flex flex-row justify-center items-center">
                  <Link to={`/sales/edit/${s.id}`} className="px-2 py-1 bg-blue-600 text-white rounded">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteSale(s.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/sales/invoice/${s.id}`}
                    className="px-2 py-1 bg-yellow-600 text-white rounded"
                  >
                    Invoice
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalesList;
