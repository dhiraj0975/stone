import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../../redux/product/productThunks";
import CustomerAPI from "../../axios/CustomersAPI";
import SalesAPI from "../../axios/salesAPI";
import { fx } from "../../utils/formatter";

const SalesForm = () => {
  const { saleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const products = useSelector((state) => state.product.list || []);

  // Local state
  const [customers, setCustomers] = useState([]);
  const [header, setHeader] = useState({ bill_no: "", bill_date: "", customer_id: "" });
  const [rows, setRows] = useState([{ product_id: "", qty: 1, rate: 0, gst_percent: 0, discount_rate: 0, discount_amount: 0, taxable_amount: 0, net_total: 0 }]);
  const [loading, setLoading] = useState(false);

  // Fetch products (Redux) & customers (API) on mount
  useEffect(() => {
    dispatch(getProducts());

    (async () => {
      try {
        const res = await CustomerAPI.getAll();
        setCustomers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load customers:", err);
        setCustomers([]);
      }
    })();
  }, [dispatch]);

  // Prefill for edit
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (saleId) {
          const res = await SalesAPI.getById(saleId);
          if (!active) return;
          const s = res.data || {};
          setHeader({
            bill_no: s.bill_no || "",
            bill_date: s.bill_date ? String(s.bill_date).slice(0, 10) : "",
            customer_id: String(s.customer_id ?? ""),
          });
          setRows(
            Array.isArray(s.items)
              ? s.items.map((i) => ({
                  product_id: String(i.product_id),
                  qty: Number(i.qty || 1),
                  rate: Number(i.rate || 0),
                  gst_percent: Number(i.gst_percent || 0),
                  discount_rate: Number(i.discount_rate || 0),
                  discount_amount: Number(i.discount_amount || 0),
                  taxable_amount: Number(i.taxable_amount || 0),
                  net_total: Number(i.net_total || 0),
                }))
              : [{ product_id: "", qty: 1, rate: 0, gst_percent: 0, discount_rate: 0, discount_amount: 0, taxable_amount: 0, net_total: 0 }]
          );
        } else {
          const res = await SalesAPI.getNewBillNo();
          if (!active) return;
          setHeader((h) => ({ ...h, bill_no: res.data.bill_no || "" }));
        }
      } catch (e) {
        console.error("Failed to load sale or generate bill no:", e);
        alert("Failed to load sale or generate bill no");
      }
    })();

    return () => { active = false; };
  }, [saleId]);

  const onHeader = (e) => setHeader((p) => ({ ...p, [e.target.name]: e.target.value }));

  const recalcItem = (item) => {
    const discount_amount = item.discount_amount || (item.rate * item.qty * (item.discount_rate || 0) / 100);
    const taxable_amount = item.rate * item.qty - discount_amount;
    const gst_amount = taxable_amount * (item.gst_percent || 0) / 100;
    const net_total = taxable_amount + gst_amount;
    return { ...item, discount_amount, taxable_amount, net_total };
  };

const onRow = (i, field, value) => {
  setRows((prev) => {
    const newRows = [...prev];
    let val = field === "qty" || field === "rate" || field === "discount_rate" ? Number(value || 0) : value;
    newRows[i] = { ...newRows[i], [field]: val };

    // Auto-fill sales_rate & GST agar product select hua
    if (field === "product_id") {
      const prod = products.find((p) => String(p.id ?? p._id) === val);
      if (prod) {
        newRows[i].rate = prod.sales_rate || 0;       // <-- yaha sales_rate use kar
        newRows[i].gst_percent = prod.gst_percent || 0;
      } else {
        newRows[i].rate = 0;
        newRows[i].gst_percent = 0;
      }
    }

    newRows[i] = recalcItem(newRows[i]);
    return newRows;
  });
};



  const addRow = () => setRows((p) => [...p, { product_id: "", qty: 1, rate: 0, gst_percent: 0, discount_rate: 0, discount_amount: 0, taxable_amount: 0, net_total: 0 }]);
  const removeRow = (i) => setRows((p) => p.filter((_, idx) => idx !== i));

  const totals = useMemo(() => {
    return rows.reduce((acc, r) => {
      acc.total_taxable += r.taxable_amount || 0;
      acc.total_gst += (r.taxable_amount || 0) * (r.gst_percent || 0) / 100;
      acc.total_amount += r.net_total || 0;
      return acc;
    }, { total_taxable: 0, total_gst: 0, total_amount: 0 });
  }, [rows]);

  const isValid = String(header.bill_no).trim() && String(header.bill_date).trim() && String(header.customer_id).trim() &&
                  rows.length > 0 && rows.every((r) => String(r.product_id).trim() && r.qty > 0 && r.rate >= 0);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return alert("Please fill all required fields and valid items");

    const payload = {
      ...header,
      items: rows.map((r) => ({
        product_id: String(r.product_id),
        qty: r.qty,
        rate: r.rate,
        discount_rate: r.discount_rate,
        discount_amount: r.discount_amount,
        gst_percent: r.gst_percent,
        taxable_amount: r.taxable_amount,
        net_total: r.net_total,
      })),
    };

    setLoading(true);
    try {
      if (saleId) await SalesAPI.update(saleId, payload);
      else await SalesAPI.create(payload);
      alert("Sale saved!");
      navigate("/sales");
    } catch (err) {
      console.error(err);
      alert("Error saving sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-3">
      <div className="grid grid-cols-3 gap-3 mb-3">
        <input type="text" placeholder="Bill No" name="bill_no" value={header.bill_no} readOnly className="border p-1 rounded bg-gray-100" />
        <input type="date" name="bill_date" value={header.bill_date} onChange={onHeader} className="border p-1 rounded" required />
        <select name="customer_id" value={header.customer_id} onChange={onHeader} className="border p-1 rounded" required>
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id ?? c._id} value={String(c.id ?? c._id)}>{c.name}</option>
          ))}
        </select>
      </div>

      <table className="w-full border mb-3">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="p-2">SI</th>
            <th className="p-2">Product</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Rate</th>
            <th className="p-2">Discount</th>
            <th className="p-2">Taxable</th>
            <th className="p-2">GST%</th>
            <th className="p-2">Net Total</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">
                <select value={r.product_id} onChange={(e) => onRow(i, "product_id", e.target.value)} className="border p-1 rounded w-full" required>
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id ?? p._id} value={String(p.id ?? p._id)}>{p.product_name}</option>
                  ))}
                </select>
              </td>
              <td className="border p-2">
                <input type="number" value={r.qty} min={1} onChange={(e) => onRow(i, "qty", e.target.value)} className="border p-1 rounded w-20" />
              </td>
              <td className="border p-2">
                <input type="number" value={r.rate} min={0} step="0.01" onChange={(e) => onRow(i, "rate", e.target.value)} readOnly  className="border p-1 rounded w-24 bg-gray-100 cursor-not-allowed" />
              </td>
              <td className="border p-2">
                <input type="number" value={r.discount_rate} min={0} max={100} step="0.01" onChange={(e) => onRow(i, "discount_rate", e.target.value)} className="border p-1 rounded w-20" />%
              </td>
              <td className="border p-2">{fx(r.taxable_amount)}</td>
              <td className="border p-2">{r.gst_percent}%</td>
              <td className="border p-2">{fx(r.net_total)}</td>
              <td className="border p-2 text-center">
                <button type="button" onClick={() => removeRow(i)} className="text-red-600">❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-3 font-bold text-right text-lg">
        Total Taxable: {fx(totals.total_taxable)}, Total GST: {fx(totals.total_gst)}, Total Amount: {fx(totals.total_amount)}
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={addRow} className="px-4 py-2 bg-blue-600 text-white rounded">Add Item</button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading || !isValid}>
          {loading ? "Saving..." : saleId ? "Update Sale" : "Save Sale"}
        </button>
      </div>
    </form>
  );
};

export default SalesForm;
