import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchases } from "../../redux/purchase/purchaseSlice";

export default function PurchaseList() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.purchases);

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  if (loading) return <p className="p-4">Loading purchases...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-4">Purchases</h2>
      {list.length === 0 ? (
        <p>No purchases found</p>
      ) : (
        <table className="w-full text-center border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">S/No</th>
              <th className="border p-2">Vendor</th>
              <th className="border p-2">Bill No</th>
              <th className="border p-2">Bill Date</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((purchase, index) => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  {purchase.vendor_name} ({purchase.firm_name})
                </td>
                <td className="border p-2">{purchase.bill_no}</td>
                <td className="border p-2">
                  {new Date(purchase.bill_date).toLocaleDateString()}
                </td>
                <td className="border p-2">₹{purchase.total_amount}</td>
                <td className="border p-2">{purchase.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
