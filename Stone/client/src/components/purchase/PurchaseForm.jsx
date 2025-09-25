import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getVendors } from "../../redux/vender/vendorThunks";
import { getProducts } from "../../redux/product/productThunks";
import PurchaseAPI from "../../axios/PurchaseAPI";
import PurchaseOrderAPI from "../../axios/PurchaseOrderAPI"; // backend fetch for PO by ID

const fx = (n) => (isNaN(n) ? "0.000" : Number(n).toFixed(3));

const PurchaseForm = () => {
  const dispatch = useDispatch();
  const { poId } = useParams();

  const { loading } = useSelector((s) => s.purchaseOrders);
  const { vendors = [] } = useSelector((s) => s.vendor);
  const { list: products = [], loading: productsLoading } = useSelector((s) => s.product);

  useEffect(() => {
    dispatch(getVendors());
    dispatch(getProducts());
  }, [dispatch]);

// Initial header state
const [header, setHeader] = useState({
  po_no: "",
  date: "",
  bill_time: "00:00",      // default time
  bill_time_am_pm: "PM",   // default AM/PM
  vendor_id: "",
  address: "",
  mobile_no: "",
  gst_no: "",
  gst_type: "ADD",
  place_of_supply: "",
  terms_condition: "",
  edit_bill: "",
});


// Initial row state
const [rows, setRows] = useState([
  { product_id: "", item_name: "", hsn_code: "", qty: 1, rate: 0, d1_percent: 0, gst_percent: 0 },
]);


  // Prefill when editing by poId
  useEffect(() => {
    if (!poId) return;
    PurchaseOrderAPI.getById(poId)
      .then((res) => {
        const po = res.data;
        // Derive time fields
        const hh = po?.bill_time?.slice(11, 13);
        const mm = po?.bill_time?.slice(14, 16);
        const ampm = Number(hh) >= 12 ? "PM" : "AM";
        const displayHH = (() => {
          let h = Number(hh || 0);
          if (h === 0) return "12"; // 00 -> 12 AM
          if (h > 12) return String(h - 12).padStart(2, "0"); // 13..23 -> 1..11 PM
          return String(h).padStart(2, "0"); // 01..12
        })();

        setHeader((p) => ({
          ...p,
          po_no: po.po_no || "",
          date: po.date || "",
          bill_time: po.bill_time ? `${displayHH}:${mm || "00"}` : "",
          bill_time_am_pm: ampm || "PM",
          vendor_id: po.vendor_id || "",
          address: po.address || "",
          mobile_no: po.mobile_no || "",
          gst_no: po.gst_no || "",
          place_of_supply: po.place_of_supply || "",
          terms_condition: po.terms_condition || "",
        }));

        setRows(
          (po.items || []).map((it) => ({
            product_id: String(it.product_id || ""),
            item_name: it.item_name || it.product_name || "",
            hsn_code: it.hsn_code || "",
            qty: Number(it.qty || 0),
            rate: Number(it.rate || 0),
            d1_percent: Number(it.d1_percent ?? it.discount_rate ?? 0),
            gst_percent: Number(it.gst_percent ?? 0),
          }))
        );
      })
      .catch((err) => console.error("PO fetch error:", err));
  }, [poId]);

  const onHeader = (e) => setHeader((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Safe Row Update
  const onRow = (i, field, value) => {
    setRows((prev) => {
      const next = [...prev];
      const numericFields = ["qty", "rate", "d1_percent", "gst_percent"];
      next[i] = {
        ...next[i],
        [field]: numericFields.includes(field) ? Number(value || 0) : value,
      };
      return next;
    });
  };

  const addRow = () =>
    setRows((p) => [
      ...p,
      { product_id: "", item_name: "", hsn_code: "", qty: 1, rate: 0, d1_percent: 0, gst_percent: 0 },
    ]);
  const removeRow = (i) => setRows((p) => p.filter((_, idx) => idx !== i));

  // Calculations
  const calc = (r) => {
    const base = (r.qty || 0) * (r.rate || 0);
    const perUnitDisc = ((r.rate || 0) * (r.d1_percent || 0)) / 100;
    const totalDisc = (r.qty || 0) * perUnitDisc;
    const taxable = Math.max(0, base - totalDisc);
    const gstAmt = (taxable * (r.gst_percent || 0)) / 100;
    const final = taxable + gstAmt;
    return { base, perUnitDisc, totalDisc, taxable, gstAmt, final };
  };

  const totals = useMemo(
    () =>
      rows.reduce(
        (a, r) => {
          const c = calc(r);
          a.base += c.base;
          a.disc += c.totalDisc;
          a.taxable += c.taxable;
          a.gst += c.gstAmt;
          a.final += c.final;
          return a;
        },
        { base: 0, disc: 0, taxable: 0, gst: 0, final: 0 }
      ),
    [rows]
  );

// -------------------- On Submit --------------------
const onSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const payload = { ...header, bill_no: header.sale_no, items: rows, summary: totals };

    if (isEditMode) {
      // ✅ Use SalesAPI.update instead of axios.put
      await SalesAPI.update(sale.id, payload);
    } else {
      await SalesAPI.create(payload);
    }

    if (onSubmitted) onSubmitted();
  } catch (err) {
    console.error(err);
    alert("Failed to save sale");
  } finally {
    setLoading(false);
  }
};






  // Validation aligned to original stricter checks
  const isFormValid =
    header.po_no.trim() !== "" &&
    header.date.trim() !== "" &&
    header.vendor_id !== "" &&
    rows.length > 0 &&
    rows.every(
      (r) =>
        String(r.product_id).trim() !== "" &&
        String(r.item_name || "").trim() !== "" &&
        Number(r.qty) > 0 &&
        Number(r.rate) > 0
    );

  return (
    <form onSubmit={onSubmit} className="p-3">
      {/* Header strip (short) */}
      <div className="grid grid-cols-6 gap-3 border p-3 rounded">
        <div className="flex flex-col">
          <label className="text-xs">PO No.</label>
          <input className="border rounded p-1" name="po_no" value={header.po_no} onChange={onHeader} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs">DATE</label>
          <input type="date" className="border rounded p-1" name="date" value={header.date} onChange={onHeader} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs">BILL TIME</label>
          <div className="flex gap-1">
           <input
  type="time"
  name="bill_time"
  value={header.bill_time || "00:00"} // fallback
  onChange={onHeader}
/>

<select
  name="bill_time_am_pm"
  value={header.bill_time_am_pm || "PM"} // fallback
  onChange={onHeader}
>
  <option>AM</option>
  <option>PM</option>
</select>

          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-xs">SUPPLIER</label>
          <select className="border rounded p-1" name="vendor_id" value={header.vendor_id} onChange={onHeader}>
            <option value="">Select</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs">ADDRESS</label>
          <input className="border rounded p-1" name="address" value={header.address} onChange={onHeader} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs">MOBILE NO</label>
          <input className="border rounded p-1" name="mobile_no" value={header.mobile_no} onChange={onHeader} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs">GST No</label>
          <input className="border rounded p-1" name="gst_no" value={header.gst_no} onChange={onHeader} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs">Place of Supply</label>
          <input
            className="border rounded p-1"
            name="place_of_supply"
            value={header.place_of_supply}
            onChange={onHeader}
          />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="text-xs">Terms</label>
          <input
            className="border rounded p-1"
            name="terms_condition"
            value={header.terms_condition}
            onChange={onHeader}
            placeholder="e.g., 30 days payment term"
          />
        </div>
      </div>

      {/* Final Amount banner */}
      <div className="bg-black text-yellow-300 text-center text-2xl font-semibold py-2 mt-3 mb-2 rounded">
        FINAL AMOUNT: {fx(totals.final)}
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full text-sm border">
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
                "per qty Disc",
                "Disc",
                "GST%",
                "GST Amt",
                "FinalAmt",
                "Actions",
              ].map((h, idx) => (
                <th key={`${h}-${idx}`} className="border px-2 py-1 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const c = calc(r);
              return (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-2 py-1">{i + 1}</td>

                  <td className="border px-2 py-1">
                    <div className="flex gap-1">
                      <select
  className="border rounded p-1 w-44"
  value={r.product_id}
  onChange={(e) => {
    const pid = e.target.value;
    const p = products.find((x) => String(x.id) === String(pid));
    
    // ✅ update product_id & item_name
    onRow(i, "product_id", pid);
    if (p) {
      onRow(i, "item_name", p.product_name || "");
      onRow(i, "hsn_code", p.hsn_code || ""); // 👈 auto-fill HSN
    }
  }}
>
  <option value="">Select</option>
  {products.map((p) => (
    <option key={p.id} value={String(p.id)}>
      {p.product_name}
    </option>
  ))}
</select>

                    </div>
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      readOnly
                      className="border cursor-not-allowed bg-gray-100 rounded p-1 w-24"
                      value={r.hsn_code}
                      onChange={(e) => onRow(i, "hsn_code", e.target.value)}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="border rounded p-1 w-20"
                      value={r.qty}
                      onChange={(e) => onRow(i, "qty", e.target.value)}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="border rounded p-1 w-20"
                      value={r.rate}
                      onChange={(e) => onRow(i, "rate", e.target.value)}
                    />
                  </td>

                  <td className="border px-2 py-1">{fx(c.base)}</td>

                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="border rounded p-1 w-16"
                      value={r.d1_percent}
                      onChange={(e) => onRow(i, "d1_percent", e.target.value)}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="border rounded p-1 w-20 bg-gray-100"
                      value={fx(c.perUnitDisc)}
                      readOnly
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="border rounded p-1 w-24 bg-gray-100"
                      value={fx(c.totalDisc)}
                      readOnly
                    />
                  </td>

                  {/* Display total discount as extra column too (as in original) */}
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="border rounded p-1 w-16"
                      value={r.gst_percent}
                      onChange={(e) => onRow(i, "gst_percent", e.target.value)}
                    />
                  </td>

                  <td className="border px-2 py-1">{fx(c.gstAmt)}</td>
                  <td className="border px-2 py-1">{fx(c.final)}</td>

                  <td className="border px-2 py-1 text-center">
                    <button type="button" className="text-red-600" onClick={() => removeRow(i)}>
                      ❌
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td className="border px-2 py-1" colSpan={5}>
                Totals
              </td>
              <td className="border px-2 py-1">{fx(totals.base)}</td>
              <td className="border px-2 py-1">—</td>
              <td className="border px-2 py-1">—</td>
              <td className="border px-2 py-1">—</td>
              <td className="border px-2 py-1">{fx(totals.disc)}</td>
              <td className="border px-2 py-1">—</td>
              <td className="border px-2 py-1">{fx(totals.gst)}</td>
              <td className="border px-2 py-1">{fx(totals.final)}</td>
              <td className="border px-2 py-1"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex gap-2 mt-3">
        <button type="button" onClick={addRow} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Item
        </button>
       <button
  type="submit"
  disabled={loading || productsLoading || !isFormValid}
  className={`px-6 py-2 rounded text-white bg-green-700 transition-opacity duration-200 ${
    loading || productsLoading || !isFormValid
      ? "opacity-50 cursor-not-allowed"
      : "opacity-100 cursor-pointer"
  }`}
>
  {loading ? "Saving..." : poId ? "Save Items" : "Save Purchase"}
</button>

      </div>
    </form>
  );
};

export default PurchaseForm;
