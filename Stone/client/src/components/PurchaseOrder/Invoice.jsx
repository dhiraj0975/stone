import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PurchaseOrderAPI from "../../axios/PurchaseOrderAPI";
import "./Invoice.css"; // ✅ import print CSS

const Invoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    PurchaseOrderAPI.getInvoice(id)
      .then((res) => setInvoice(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!invoice) return <p>Loading invoice...</p>;

  return (
    <div id="invoice-print" className="p-6 bg-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNo}</h1>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🖨️ Print
        </button>
      </div>

      <p>Date: {invoice.date}</p>
      <p>Vendor: {invoice.vendor?.name}</p>
      <p>GST No: {invoice.vendor?.gst_no}</p>

      <table className="w-full mt-4 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Item</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">GST</th>
            <th className="border p-2">Final</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={idx}>
              <td className="border p-2">{item.product_id}</td>
              <td className="border p-2">{item.qty}</td>
              <td className="border p-2">{item.rate}</td>
              <td className="border p-2">{item.amount}</td>
              <td className="border p-2">{item.gst_amount}</td>
              <td className="border p-2">{item.final_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <p>Total Taxable: {invoice.summary.total_taxable}</p>
        <p>Total GST: {invoice.summary.total_gst}</p>
        <h2 className="font-bold text-lg">
          Grand Total: {invoice.summary.grand_total}
        </h2>
      </div>
    </div>
  );
};

export default Invoice;
