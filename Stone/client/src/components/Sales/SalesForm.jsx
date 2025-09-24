import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SalesAPI from "../../axios/salesAPI";
import { fx } from "../../utils/formatter";

const SalesForm = ({ products = [], customers = [] }) => {
  const { saleId } = useParams();
  const navigate = useNavigate();

  const [header, setHeader] = useState({
    bill_no: "",
    bill_date: "",
    customer_id: "",
  });

  const [rows, setRows] = useState([{ product_id: "", qty: 1, rate: 0 }]);
  const [loading, setLoading] = useState(false);

  // Edit-mode prefill
  useEffect(() => {
    let active = true;
    if (!saleId) return;
    (async () => {
      try {
        const res = await SalesAPI.getById(saleId);
        if (!active) return;
        const s = res.data || {};
        setHeader({
          bill_no: s.bill_no || "",
          bill_date: s.bill_date ? String(s.bill_date).slice(0, 10) : "",
          customer_id: String(s.customer_id ?? s.customer?._id ?? s.customer?.id ?? ""),
        });
        setRows(
          Array.isArray(s.items)
            ? s.items.map((i) => ({
                product_id: String(i.product_id ?? i._id ?? i.id ?? ""),
                qty: Number(i.qty || 0),
                rate: Number(i.rate || 0),
              }))
            : [{ product_id: "", qty: 1, rate: 0 }]
        );
      } catch (e) {
        console.error("Failed to load sale:", e);
        alert("Failed to load sale");
      }
    })();
    return () => {
      active = false;
    };
  }, [saleId]);

  const onHeader = (e) =>
    setHeader((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));

  const onRow = (i, field, value) =>
    setRows((prev) => {
      const next = [...prev];
      const numeric = field === "qty" || field === "rate";
      next[i] = { ...next[i], [field]: numeric ? Number(value || 0) : value };
      return next;
    });

  const addRow = () =>
    setRows((p) => [...p, { product_id: "", qty: 1, rate: 0 }]);

  const removeRow = (i) => setRows((p) => p.filter((_, idx) => idx !== i));

  // Totals
  const totals = useMemo(
    () =>
      rows.reduce(
        (a, r) => {
          const amt = (Number(r.qty) || 0) * (Number(r.rate) || 0);
          a.total += amt;
          return a;
        },
        { total: 0 }
      ),
    [rows]
  );

  // Basic form validation
  const isValid =
    String(header.bill_no).trim() !== "" &&
    String(header.bill_date).trim() !== "" &&
    String(header.customer_id).trim() !== "" &&
    rows.length > 0 &&
    rows.every(
      (r) =>
        String(r.product_id).trim() !== "" &&
        Number(r.qty) > 0 &&
        Number(r.rate) >= 0
    );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      alert("Please fill all required fields and valid items");
      return;
    }
    const payload = {
      ...header,
      customer_id: String(header.customer_id),
      items: rows.map((r) => ({
        product_id: String(r.product_id),
        qty: Number(r.qty),
        rate: Number(r.rate),
        amount: Number(r.qty) * Number(r.rate),
      })),
      summary: {
        total_amount: totals.total,
      },
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
        <input
          type="text"
          placeholder="Bill No"
          name="bill_no"
          value={header.bill_no}
          onChange={onHeader}
          className="border p-1 rounded"
          required
        />
        <input
          type="date"
          name="bill_date"
          value={header.bill_date}
          onChange={onHeader}
          className="border p-1 rounded"
          required
        />
        <select
          name="customer_id"
          value={header.customer_id}
          onChange={onHeader}
          className="border p-1 rounded"
          required
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id ?? c._id} value={String(c.id ?? c._id)}>
              {c.name}
            </option>
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
            <th className="p-2">Amount</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const amt = (Number(r.qty) || 0) * (Number(r.rate) || 0);
            return (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">
                  <select
                    value={r.product_id}
                    onChange={(e) => onRow(i, "product_id", e.target.value)}
                    className="border p-1 rounded w-full"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.id ?? p._id} value={String(p.id ?? p._id)}>
                        {p.product_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={r.qty}
                    onChange={(e) => onRow(i, "qty", e.target.value)}
                    className="border p-1 rounded w-24"
                    min={1}
                    required
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={r.rate}
                    onChange={(e) => onRow(i, "rate", e.target.value)}
                    className="border p-1 rounded w-24"
                    min={0}
                    step="0.01"
                    required
                  />
                </td>
                <td className="border p-2">{fx(amt)}</td>
                <td className="border p-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="text-red-600"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mb-3 font-bold text-right text-lg">
        Total: {fx(totals.total)}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={addRow}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Item
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
          disabled={loading || !isValid}
        >
          {loading ? "Saving..." : saleId ? "Update Sale" : "Save Sale"}
        </button>
      </div>
    </form>
  );
};

export default SalesForm;
