import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // ✅ useDispatch import
import { Link } from "react-router-dom";
import salesAPI from "../../axios/salesAPI";
import { fx } from "../../utils/formatter";
import { getProducts } from "../../redux/product/productThunks";


const SalesList = () => {
    const dispatch = useDispatch(); // ✅ dispatch initialize
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const products = useSelector(state => state.product.list); // Redux product list

useEffect(() => {
  const fetchSales = async () => {
    try {
      setLoading(true);

      // Load products from Redux
      await dispatch(getProducts());

      // Get all sales
      const res = await salesAPI.getAll();
      const sales = res.data;

      // For each sale, fetch its items
      const salesWithItems = await Promise.all(
        sales.map(async (s) => {
          const itemsRes = await salesAPI.getItemsBySaleId(s.id);
          return { ...s, items: itemsRes.data };
        })
      );

      setSales(salesWithItems);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  fetchSales();
}, [dispatch]); // ✅ useSelector yaha nahi



  const deleteSale = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await salesAPI.delete(id);
      setSales((prev) => prev.filter((s) => s.id !== id));
      alert("Sale deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting sale");
    }
  };

  // Calculate totals for a sale
  const calculateTotals = (items) => {
    return (items || []).reduce(
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
        <div className="overflow-auto">
          {sales.map((s) => {
            const totals = calculateTotals(s.items);
            return (
              <div key={s.id} className="mb-6 border rounded shadow-sm">
                {/* Sale Header */}
                <div className="bg-gray-100 px-3 py-2 flex justify-between items-center">
                  <div>
                    <strong>Bill No:</strong> {s.bill_no} | <strong>Date:</strong>{" "}
                    {s.bill_date} | <strong>Customer:</strong> {s.customer_name} |{" "}
                    <strong>Status:</strong> {s.status}
                    <strong>Payment:</strong> {s.payment_status} ({s.payment_method})
                  </div>
                  <div className="flex gap-2">
<Link
  to={`/sales/edit/${s.id}`}
  state={{ sale: s }}
  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
>
  Edit
</Link>

                    <button
                      onClick={() => deleteSale(s.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition active:scale-95"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/sales/invoice/${s.id}`}
                      className="px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                    >
                      Invoice
                    </Link>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border text-sm text-center">
                    <thead className="bg-green-700 text-white">
                      <tr>
                        {[
                          "SI",
                          "Item Name",
                          "HSNCode",
                          "Qty",
                          "Rate",
                          "Amount",
                          "Disc %",
                          "Per Qty Disc",
                          "Disc",
                          "GST %",
                          "GST Amt",
                          "FinalAmt",
                          "Payment"
                        ].map((h, idx) => (
                          <th key={idx} className="border px-2 py-1">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
  {(s.items || []).map((r, i) => {
    const base = (r.qty || 0) * (r.rate || 0);
    const perUnitDisc = ((r.rate || 0) * (r.discount_rate || 0)) / 100;
    const totalDisc = (r.qty || 0) * perUnitDisc;
    const taxable = Math.max(base - totalDisc, 0);
    const gstAmt = (taxable * (r.gst_percent || 0)) / 100;
    const final = taxable + gstAmt;

    return (
 <tr key={i} className="odd:bg-white even:bg-gray-50">
  <td className="border px-2 py-1">{i + 1}</td>
  <td className="border px-2 py-1">
    {products.find(p => Number(p.id) === Number(r.product_id))?.product_name || "—"}
  </td>
  <td className="border px-2 py-1">
    {products.find(p => Number(p.id) === Number(r.product_id))?.hsn_code || "—"}
  </td>
  <td className="border px-2 py-1">{r.qty || 0}</td>
  <td className="border px-2 py-1">{fx(r.rate)}</td>
  <td className="border px-2 py-1">{fx(base)}</td>
  <td className="border px-2 py-1">{r.discount_rate || 0}</td>
  <td className="border px-2 py-1">{fx(perUnitDisc)}</td>
  <td className="border px-2 py-1">{fx(totalDisc)}</td>
  <td className="border px-2 py-1">{r.gst_percent || 0}</td>
  <td className="border px-2 py-1">{fx(gstAmt)}</td>
  <td className="border px-2 py-1 font-semibold">{fx(final)}</td>
</tr>


    );
  })}
</tbody>

                    <tfoot>
  <tr className="bg-gray-100 font-semibold">
    <td colSpan={5} className="border px-2 py-1 text-right">
      Totals
    </td>
    <td className="border px-2 py-1">{fx(totals.total_taxable)}</td>
    <td className="border px-2 py-1">—</td>
    <td className="border px-2 py-1">—</td>
    <td className="border px-2 py-1">{fx(
      (sales.reduce((acc, s) => {
        return acc + (s.items || []).reduce((a, r) => {
          const perUnitDisc = ((r.rate || 0) * (r.discount_rate || 0)) / 100;
          return a + ((r.qty || 0) * perUnitDisc);
        }, 0);
      }, 0))
    )}</td>
    <td className="border px-2 py-1">—</td>
    <td className="border px-2 py-1">{fx(totals.total_gst)}</td>
    <td className="border px-2 py-1">{fx(totals.total_amount)}</td>
    <td className="border px-2 py-1">
  {s.payment_status}({s.payment_method})
</td>
  </tr>
</tfoot>

                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SalesList;




