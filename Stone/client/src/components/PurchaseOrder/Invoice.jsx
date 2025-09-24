import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PurchaseOrderAPI from "../../axios/PurchaseOrderAPI";
import { useSelector } from "react-redux";
import "./Invoice.css";

const Invoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [vendorInfo, setVendorInfo] = useState(null);
  const vendors = useSelector((s) => s.vendor.vendors || []);
  const vendor = invoice ? vendors.find((v) => String(v.id ?? v._id) === String(invoice.vendor_id)) : null;


useEffect(() => {
  let active = true;

  // Fetch invoice
  PurchaseOrderAPI.getInvoice(id)
    .then((res) => {
      if (!active) return;
      const data = res.data;
      setInvoice(data);

      // Safely find vendor after invoice and vendors are ready
      const v = vendors.find(v => String(v.id ?? v._id) === String(data.vendor_id));
      setVendorInfo(v || null);
    })
    .catch((err) => console.error("Invoice fetch error:", err));

  return () => {
    active = false;
  };
}, [id, vendors]); // ✅ vendors dependency add kiya
  if (!invoice) return <p>Loading invoice...</p>;

  const fmt = (val) => Number(val || 0).toFixed(2);

  // Totals (numbers only)
  const totalTaxable = (invoice.items || []).reduce(
    (sum, i) => sum + (parseFloat(i.taxable_amount) || 0),
    0
  );
  const totalGst = (invoice.items || []).reduce(
    (sum, i) => sum + (parseFloat(i.gst_amount) || 0),
    0
  );
  const grandTotal = (invoice.items || []).reduce(
    (sum, i) =>
      sum +
      ((parseFloat(i.amount) || 0) + (parseFloat(i.gst_amount) || 0)),
    0
  );

  return (
    <div id="invoice-print" className="p-6 bg-white shadow rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNo || "N/A"}</h1>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🖨️ Print
        </button>
      </div>

      {/* Parties and meta */}
      <div className="mb-4">
        <p><strong>Date:</strong> {invoice.date || "N/A"}</p>
       <p><strong>Vendor:</strong> {invoice && vendors.find(v => String(v.id ?? v._id) === String(invoice.vendor_id))?.name || "N/A"}</p>
<p><strong>GST No:</strong> {invoice && vendors.find(v => String(v.id ?? v._id) === String(invoice.vendor_id))?.gst_no || "N/A"}</p>
<p><strong>Address:</strong> {invoice && vendors.find(v => String(v.id ?? v._id) === String(invoice.vendor_id))?.address || "N/A"}</p>
<p><strong>Mobile:</strong> {invoice && vendors.find(v => String(v.id ?? v._id) === String(invoice.vendor_id))?.mobile_no || "N/A"}</p>
      </div>

      {/* Items table with footer totals */}
      <table className="w-full mt-4 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">SI</th>
            <th className="border p-2">Product Name</th>
            <th className="border p-2">HSN Code</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">GST%</th>
            <th className="border p-2">GST Amount</th>
            <th className="border p-2">Final Amount</th>
          </tr>
        </thead>
        <tbody>
          {(invoice.items || []).map((item, idx) => {
            const finalAmount =
              (parseFloat(item.amount) || 0) + (parseFloat(item.gst_amount) || 0);
            return (
              <tr key={idx} className="odd:bg-white even:bg-gray-50">
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">{item.item_name || item.product_name || "N/A"}</td>
                <td className="border p-2">{item.hsn_code || "-"}</td>
                <td className="border p-2">{fmt(item.qty)}</td>
                <td className="border p-2">{fmt(item.rate)}</td>
                <td className="border p-2">{fmt(item.amount)}</td>
                <td className="border p-2">{fmt(item.gst_percent || 0)}%</td>
                <td className="border p-2">{fmt(item.gst_amount)}</td>
                <td className="border p-2">{fmt(finalAmount)}</td>
              </tr>
            );
          })}
        </tbody>

        {/* Footer totals directly under Final Amount column */}
        <tfoot>
          <tr className="bg-gray-50">
            <td className="border p-2 text-right font-bold" colSpan={6}>
              Totals
            </td>
            <td className="border p-2 text-right font-bold">—</td>
            <td className="border p-2 text-right font-bold">{fmt(totalGst)}</td>
            <td className="border p-2 text-right font-bold">{fmt(grandTotal)}</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border p-2 text-right font-bold" colSpan={8}>
              Total Taxable
            </td>
            <td className="border p-2 text-right font-bold">{fmt(totalTaxable)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Bold summary block below table (optional but good for print) */}
      <div className="mt-4 text-right">
        <p className="font-bold">Total Taxable: {fmt(totalTaxable)}</p>
        <p className="font-bold">Total GST: {fmt(totalGst)}</p>
        <h2 className="text-lg font-bold">Grand Total: {fmt(grandTotal)}</h2>
      </div>
    </div>
  );
};

export default Invoice;
