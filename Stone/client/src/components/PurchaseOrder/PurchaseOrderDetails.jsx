import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchaseOrderById } from  "../../redux/purchaseOrders/purchaseOrderSlice";
import { useParams } from "react-router-dom";

const PurchaseOrderDetails = () => {
  const { id } = useParams(); // URL se PO id milegi
  const dispatch = useDispatch();
const { current, loading, error } = useSelector(
  (state) => state.purchaseOrders
);

  useEffect(() => {
    if (id) {
      dispatch(fetchPurchaseOrderById(id));
    }
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
if (!current) return <p>No Purchase Order Found</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Purchase Order Details</h2>

      {/* ✅ PO Header Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <p><strong>PO No:</strong> {current.po_no}</p>
        <p><strong>Date:</strong> {current.date}</p>
        <p><strong>Bill Date:</strong> {current.bill_time}</p>
        <p><strong>Vendor ID:</strong> {current.vendor_id}</p>
        <p><strong>Mobile:</strong> {current.mobile_no}</p>
        <p><strong>GST No:</strong> {current.gst_no}</p>
        <p><strong>Delivery Place:</strong> {current.place_of_delivery}</p>
        <p><strong>Terms:</strong> {current.terms_and_conditions}</p>
      </div>

      {/* ✅ PO Items Table */}
      <h3 className="text-lg font-semibold mb-2">Items</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">S.No</th>
            <th className="border p-2">Item Name</th>
            <th className="border p-2">HSN Code</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Disc %</th>
            <th className="border p-2">Disc Amt</th>
          </tr>
        </thead>
        <tbody>
          {current.items && current.items.length > 0 ? (
            current.items.map((item, index) => (
              <tr key={item.id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{item.item_name}</td>
                <td className="border p-2">{item.hsn_code}</td>
                <td className="border p-2 text-center">{item.qty}</td>
                <td className="border p-2 text-right">{item.rate}</td>
                <td className="border p-2 text-right">{item.amount}</td>
                <td className="border p-2 text-center">{item.discount_rate}%</td>
                <td className="border p-2 text-right">{item.discount_total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center p-4">
                No Items Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ GST + Grand Total */}
      <div className="mt-6">
        <p><strong>GST %:</strong> {current.gst_percent}</p>
        <p><strong>Total Amount:</strong> {current.total_amount}</p>
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;
