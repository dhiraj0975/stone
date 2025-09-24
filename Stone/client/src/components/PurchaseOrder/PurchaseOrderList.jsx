import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchaseOrders, deletePurchaseOrder } from "../../redux/purchaseOrders/purchaseOrderSlice";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../redux/product/productThunks";



const fx = (n) => (isNaN(n) ? "0.000" : Number(n).toFixed(3));

const PurchaseOrderList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((state) => state.purchaseOrders);
  const { list: products = [] } = useSelector((state) => state.product);
  const [open, setOpen] = useState({}); // row expand/collapse

  // Helper function to check if all items are purchased
const isFullyPurchased = (po) => {
  return po.items.every(item => (item.purchased_qty ?? 0) >= (item.qty ?? 0));
};


  // date ko yyyy-mm-dd format me normalize karne ke liye
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return "-";
  return d.toISOString().split("T")[0]; // form ke jaisa
};

// bill time ko hh:mm AM/PM me format karne ke liye
const formatBillTime = (billTime) => {
  if (!billTime) return "-";
  const d = new Date(billTime);
  if (isNaN(d)) return "-";
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
};


  useEffect(() => {
    dispatch(fetchPurchaseOrders());
     dispatch(getProducts()); 
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Purchase Orders</h2>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 ">PO No</th>
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Bill Time</th>
            <th className="border p-2">GST No</th>
            {/* <th className="border p-2">GST Type</th> */}
            <th className="border p-2">Place of Supply</th>
            <th className="border p-2">Terms</th>
            <th className="border p-2">TAX Total</th>
            <th className="border p-2">GST Total</th>
            <th className="border p-2">Final Total</th>
            <th className="border p-2">Action</th>
            {/* <th className="border p-2">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan="14" className="text-center p-4">No Purchase Orders Found</td>
            </tr>
          ) : (
            list.map((po) => {
              const sid = po.id || po._id;
              return (
                <React.Fragment key={sid}>
                  <tr className="odd:bg-white even:bg-gray-50">
                    <td className="border p-2">
                      <button className="underline cursor-pointer text-blue-500" onClick={() => setOpen((o) => ({ ...o, [sid]: !o[sid] }))}>
                        {po.po_no || "-"}
                      </button>
                    </td>
                    <td className="border p-2">{po.vendor_name || po.vendor_id || "-"}</td>
                    <td className="border p-2">{po.address || "-"}</td>
                    <td className="border p-2">{po.mobile_no || "-"}</td>
                   <td className="border p-2">{formatDate(po.date)}</td>
<td className="border p-2">{formatBillTime(po.bill_time)}</td>
                    <td className="border p-2">{po.gst_no || "-"}</td>
                    {/* <td className="border p-2">{po.gst_type || "-"}</td> */}
                    <td className="border p-2">{po.place_of_supply || "-"}</td>
                    <td className="border p-2 truncate max-w-[220px]" title={po.terms_condition}>
                      {po.terms_condition || "-"}
                    </td>
                    <td className="border p-2">{fx(po?.summary?.total_taxable ?? po.total_taxable ?? 0)}</td>
                    <td className="border p-2">{fx(po?.summary?.total_gst ?? po.total_gst ?? 0)}</td>
                    <td className="border p-2 font-semibold">{fx(po?.summary?.grand_total ?? po.grand_total ?? 0)}</td>
                    <td className="border p-2 text-center space-x-2">
  <button
    className="px-3 py-1 bg-yellow-500 text-white rounded"
    onClick={() => onEdit(po)}
  >
    ✏️ Edit
  </button>
  <button
    className="px-3 py-1 bg-blue-500 text-white rounded"
    onClick={() => navigate(`/invoice/${sid}`)}
  >
    📄 Invoice
  </button>
  <button
    className="px-3 py-1 bg-red-500 text-white rounded"
    onClick={() => dispatch(deletePurchaseOrder(sid))}
  >
    ❌ Delete
  </button>
</td>

                    {/* <td className="border p-2 text-center">
                      <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => dispatch(deletePurchaseOrder(sid))}>
                        ❌ Delete
                      </button>
                    </td> */}
                  </tr>

                  {open[sid] && (
                    <tr>
                      <td colSpan="14" className="bg-gray-200 border p-0">
                        <div className="p-3">
                          <div className="text-sm  font-semibold mb-2">Items</div>
                          <div className="overflow-auto">
                            <table className="w-full border text-xs">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="border p-1">#</th>
                                  <th className="border p-1">Item Name</th>
                                  <th className="border p-1">HSN</th>
                                  <th className="border p-1">Qty</th>
                                  <th className="border p-1">Rate</th>
                                  <th className="border p-1">Amount</th>
                                  <th className="border p-1">D%</th>
                                  <th className="border p-1">D/Unit</th>
                                  <th className="border p-1">Disc</th>
                                  <th className="border p-1">Taxable</th>
                                  <th className="border p-1">GST%</th>
                                  <th className="border p-1">GST Amt</th>
                                  <th className="border p-1">Total</th>
                                  <th className="border p-1">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(po.items || []).map((it, idx) => (
                                  <tr key={idx} className="odd:bg-white even:bg-gray-50">
                                    <td className="border p-1">{idx + 1}</td>
<td className="border p-1">
  {it.item_name || products.find(p => String(p.id) === String(it.product_id))?.product_name || "null"}
</td>
                                    <td className="border p-1">{it.hsn_code || "-"}</td>
                                    <td className="border p-1">{it.qty}</td>
                                    <td className="border p-1">{fx(it.rate)}</td>
                                    <td className="border p-1">{fx(it.amount)}</td>
                                    <td className="border p-1">{it.discount_rate ?? it.d1_percent ?? 0}</td>
                                    <td className="border p-1">{fx(it.discount_per_qty ?? it.discount_per_unit ?? 0)}</td>
                                    <td className="border p-1">{fx(it.discount_total ?? it.discount_amount ?? 0)}</td>
                                    <td className="border p-1">{fx(it.taxable_amount ?? 0)}</td>
                                    <td className="border p-1">{it.gst_percent ?? 0}</td>
                                    <td className="border p-1">{fx(it.gst_amount ?? 0)}</td>
                                    <td className="border p-1 font-semibold">{fx(it.total ?? 0)}</td>
                                    <td className="border p-2 text-center space-x-2">
  <button
    className="p-3 cursor-pointer active:scale-95 py-1 bg-red-500 text-white rounded"
    onClick={() => dispatch(deletePurchaseOrder(sid))}
  >
    ❌ Delete
  </button>
  {/* ✅ Update/Edit Button */}
<button
  className="px-3 py-1 cursor-pointer active:scale-95 bg-yellow-500 text-white rounded"
  onClick={() =>
    navigate(`/purchase-orders/edit/${sid}`, {
      state: { po }, // Pass the purchase order data
    })
  }
>
  ✏️ Edit
</button>


  <button
    className="px-3 cursor-pointer active:scale-95 py-1 bg-green-500 text-white rounded"
    onClick={() =>
      navigate(`/purchases/create/${sid}`, {
        state: { po }, // pass data for auto-fill
        replace: false,
      })
    }
  >
    ➕ Purchase
  </button>

  {/* ✅ New Invoice Button */}
  <button
    className="px-3 py-1 cursor-pointer active:scale-95 bg-blue-500 text-white rounded"
    onClick={() => navigate(`/invoice/${sid}`)}
  >
    📄 Invoice
  </button>
</td>

                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderList;