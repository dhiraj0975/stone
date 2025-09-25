import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import salesAPI from "../../axios/salesAPI";
// import { useSelector } from "react-redux";
import { fx } from "../../utils/formatter";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/product/productThunks";
import "./Invoice.css";

const SalesInvoice = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
 const dispatch = useDispatch();
const products = useSelector(state => state.product.list || []);

useEffect(() => {
  let active = true;

  const fetchSale = async () => {
    try {
      if (!products.length) {
        await dispatch(getProducts());
      }

      const res = await salesAPI.getById(id);
      const itemsRes = await salesAPI.getItemsBySaleId(id);

      if (!active) return;

      // Optional: merge product info with items here
      const itemsWithProduct = (itemsRes.data || []).map(r => {
        const product = products.find(p => Number(p.id) === Number(r.product_id));
        return { ...r, product_name: product?.product_name || "—", hsn_code: product?.hsn_code || "—" };
      });

      setSale({ ...res.data, items: itemsWithProduct });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch sale");
    }
  };

  fetchSale();

  return () => { active = false; }
}, [id, dispatch, products.length]);


  if (!sale) return <p>Loading sale invoice...</p>;

  const fmt = (val) => Number(val || 0).toFixed(2);

  // Totals
  const totals = (sale.items || []).reduce(
    (acc, r) => {
      const base = (r.qty || 0) * (r.rate || 0);
      const perUnitDisc = ((r.rate || 0) * (r.discount_rate || 0)) / 100;
      const totalDisc = (r.qty || 0) * perUnitDisc;
      const taxable = Math.max(base - totalDisc, 0);
      const gstAmt = (taxable * (r.gst_percent || 0)) / 100;
      const final = taxable + gstAmt;

      acc.total_taxable += taxable;
      acc.total_gst += gstAmt;
      acc.total_amount += final;
      return acc;
    },
    { total_taxable: 0, total_gst: 0, total_amount: 0 }
  );

  return (
    <div id="invoice-print" className="p-6 bg-white shadow rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Invoice #{sale.bill_no}</h1>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🖨️ Print
        </button>
      </div>

      {/* Sale meta */}
      <div className="mb-4">
        <p><strong>Date:</strong> {sale.bill_date}</p>
        <p><strong>Customer:</strong> {sale.customer_name}</p>
        <p><strong>Status:</strong> {sale.status}</p>
        <p><strong>Payment:</strong> {sale.payment_status} ({sale.payment_method})</p>
      </div>

      {/* Items Table */}
      <table className="w-full border mt-4">
        <thead className="bg-gray-100">
          <tr>
            {["SI", "Item Name", "HSN Code", "Qty", "Rate", "Amount", "Disc %", "GST%", "GST Amount", "Final Amount"].map((h,i)=>(
              <th key={i} className="border p-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(sale.items || []).map((r, i) => {
            const base = (r.qty || 0) * (r.rate || 0);
            const perUnitDisc = ((r.rate || 0) * (r.discount_rate || 0)) / 100;
            const totalDisc = (r.qty || 0) * perUnitDisc;
            const taxable = Math.max(base - totalDisc, 0);
            const gstAmt = (taxable * (r.gst_percent || 0)) / 100;
            const final = taxable + gstAmt;

            const product = products.find(p => Number(p.id) === Number(r.product_id));

            return (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                <td className="border text-center p-2">{i + 1}</td>
                <td className="border text-center p-2">{product?.product_name || "—"}</td>
                <td className="border text-center p-2">{product?.hsn_code || "—"}</td>
                <td className="border text-center p-2">{r.qty || 0}</td>
                <td className="border text-center p-2">{fx(r.rate)}</td>
                <td className="border text-center p-2">{fx(base)}</td>
                <td className="border text-center p-2">{r.discount_rate || 0}</td>
                <td className="border text-center p-2">{r.gst_percent || 0}</td>
                <td className="border text-center p-2">{fx(gstAmt)}</td>
                <td className="border text-center p-2 font-semibold">{fx(final)}</td>
              </tr>
            )
          })}
        </tbody>

        <tfoot>
          <tr className="bg-gray-50 font-bold">
            <td className="border text-center p-2 text-right" colSpan={5}>Totals</td>
            <td className="border text-center p-2">{fx(totals.total_taxable)}</td>
            <td className="border text-center p-2">—</td>
            <td className="border text-center p-2">—</td>
            <td className="border text-center p-2">{fx(totals.total_gst)}</td>
            <td className="border text-center p-2">{fx(totals.total_amount)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SalesInvoice;
