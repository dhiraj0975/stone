import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchaseOrders, deletePurchaseOrder } from "../../redux/purchaseOrders/purchaseOrderSlice";

const PurchaseOrderList = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.purchaseOrders);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Purchase Orders</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">PO No</th>
            <th className="border p-2">Vendor ID</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Bill Date</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">GST No</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No Purchase Orders Found
              </td>
            </tr>
          ) : (
            list.map((po) => (
              <tr key={po.id}>
                <td className="border p-2">{po.po_no}</td>
                <td className="border p-2">{po.vendor_id}</td>
                <td className="border p-2">{po.date}</td>
                <td className="border p-2">{po.bill_date}</td>
                <td className="border p-2">{po.mobile_no}</td>
                <td className="border p-2">{po.gst_no}</td>
                <td className="border p-2 text-center">
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => dispatch(deletePurchaseOrder(po.id))}
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderList;
