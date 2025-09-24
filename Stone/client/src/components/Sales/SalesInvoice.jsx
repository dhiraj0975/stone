import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SalesAPI from "../../axios/salesAPI";
import { fx } from "../../utils/formatter";

const SalesInvoice = () => {
  const { saleId } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!saleId) return;
    SalesAPI.getInvoice(saleId)
      .then((res) => {
        setSale(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching invoice:", err);
        setLoading(false);
      });
  }, [saleId]);

  if (loading) return <div>Loading...</div>;
  if (!sale) return <div>No sale found!</div>;

  const totalAmount = sale.items.reduce((a, i) => a + i.qty * i.rate, 0);

  return (
    <div className="p-3 max-w-3xl mx-auto border shadow rounded bg-white">
      <h2 className="text-2xl font-bold text-center mb-3">Sales Invoice</h2>
      <div className="mb-2 flex justify-between">
        <div>
          <div><strong>Bill No:</strong> {sale.bill_no}</div>
          <div><strong>Date:</strong> {sale.bill_date}</div>
          <div><strong>Customer:</strong> {sale.customer_name}</div>
        </div>
        <div>
          <div><strong>Status:</strong> {sale.status}</div>
        </div>
      </div>

      <table className="w-full border text-sm mb-3">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th>SI</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item, idx) => (
            <tr key={item.id} className="odd:bg-white even:bg-gray-50">
              <td>{idx + 1}</td>
              <td>{item.product_name}</td>
              <td>{item.qty}</td>
              <td>{fx(item.rate)}</td>
              <td>{fx(item.qty * item.rate)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold bg-gray-100">
            <td colSpan={4} className="text-right px-2 py-1">Total</td>
            <td className="px-2 py-1">{fx(totalAmount)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="text-center mt-4">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default SalesInvoice;
