import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVendors } from "../../redux/vender/vendorThunks";
import { getProducts } from "../../redux/product/productThunks";
import { createPurchaseOrder } from "../../redux/purchaseOrders/purchaseOrderSlice";

const fx = (n) => (isNaN(n) ? "0.000" : Number(n).toFixed(3));

const PurchaseOrderForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.purchaseOrders);
  const { vendors = [] } = useSelector((s) => s.vendor);
  const { list: products = [], loading: productsLoading } = useSelector((s) => s.product);

  useEffect(() => {
    dispatch(getVendors());
    dispatch(getProducts());
  }, [dispatch]);

  const [header, setHeader] = useState({
    po_no: "",
    date: "",
    bill_time: "",
    bill_time_am_pm: "PM",
    vendor_id: "",
    address: "",
    mobile_no: "",
    gst_no: "",
    gst_type: "ADD",
    place_of_supply: "",
    terms_condition: "",
    edit_bill: "",
  });

  const [rows, setRows] = useState([
    { product_id: "", item_name: "", hsn_code: "", qty: 1, rate: "", d1_percent: 0 + "%", gst_percent: 0 },
  ]);

  const onHeader = (e) => setHeader((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onRow = (i, field, value) => {
    setRows((prev) => {
      const next = [...prev];
      const numeric = ["qty", "rate", "d1_percent", "gst_percent"].includes(field);
      next[i] = { ...next[i], [field]: numeric ? Number(value || 0) : value };
      return next;
    });
  };

  const addRow = () =>
    setRows((p) => [...p, { product_id: "", item_name: "", hsn_code: "", qty: 1, rate: 0, d1_percent: 0, gst_percent: 0 }]);
  const removeRow = (i) => setRows((p) => p.filter((_, idx) => idx !== i));

  // Calculations as requested
  const calc = (r) => {
    const base = (r.qty || 0) * (r.rate || 0);
    const perUnitDisc = ((r.rate || 0) * (r.d1_percent || 0)) / 100;   // D2
    const totalDisc = (r.qty || 0) * perUnitDisc;                      // D3 = Disc
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

  const onSubmit = async (e) => {
    e.preventDefault();
    let [h = "00", m = "00"] = String(header.bill_time || "00:00").split(":");
h = Number(h);
if (header.bill_time_am_pm === "PM" && h < 12) h += 12;
if (header.bill_time_am_pm === "AM" && h === 12) h = 0;
const bill_time = `${header.date || ""} ${String(h).padStart(2,'0')}:${m}:00`;


    const items = rows.map((r) => {
      const c = calc(r);
      return {
        ...r,
        amount: c.base,
        discount_rate: r.d1_percent,
        discount_per_qty: c.perUnitDisc,
        discount_total: c.totalDisc,
        taxable_amount: c.taxable,
        gst_amount: c.gstAmt,
        total: c.final,
      };
    });

    await dispatch(
      createPurchaseOrder({
        ...header,
        bill_time,
        items,
        summary: {
          total_amount: totals.base,
          total_discount: totals.disc,
          total_taxable: totals.taxable,
          total_gst: totals.gst,
          grand_total: totals.final,
        },
      })
    );
  };

  return (
    <form onSubmit={onSubmit} className="p-3">
      {/* Header strip (short) */}
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
      <input type="time" className="border rounded p-1 w-full" name="bill_time" value={header.bill_time} onChange={onHeader} />
      <select name="bill_time_am_pm" className="border rounded p-1" value={header.bill_time_am_pm} onChange={onHeader}>
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
        <option key={v.id} value={v.id}>{v.name}</option>
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

  {/* NEW: GST No */}
  <div className="flex flex-col">
    <label className="text-xs">GST No</label>
    <input className="border rounded p-1" name="gst_no" value={header.gst_no} onChange={onHeader} />
  </div>

  {/* NEW: Place of Supply */}
  <div className="flex flex-col">
    <label className="text-xs">Place of Supply</label>
    <input className="border rounded p-1" name="place_of_supply" value={header.place_of_supply} onChange={onHeader} />
  </div>

  {/* NEW: Terms & Conditions */}
  <div className="flex flex-col col-span-2">
    <label className="text-xs">Terms</label>
    <input className="border rounded p-1" name="terms_condition" value={header.terms_condition} onChange={onHeader} placeholder="e.g., 30 days payment term" />
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
              {["SI", "Item Name", "HSNCode", "Qty", "Rate", "Amount", "Disc %", "per qty Disc", "Disc", "GST%", "GST Amt", "FinalAmt", "Actions"].map(
  (h, idx) => (
    <th key={`${h}-${idx}`} className="border px-2 py-1 text-left">
      {h}
    </th>
  )
)}
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
                          const p = products.find((x) => x.id === pid);
                          onRow(i, "product_id", pid);
                          if (p) onRow(i, "item_name", p.product_name || "");
                        }}
                      >
                        <option value="">Select</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.product_name}
                          </option>
                        ))}
                      </select>
                      {/* <input
                        className="border rounded p-1 w-24"
                        placeholder="Item Name"
                        value={r.item_name}
                        onChange={(e) => onRow(i, "item_name", e.target.value)}
                      /> */}
                    </div>
                  </td>

                  <td className="border px-2 py-1">
                    <input className="border rounded p-1 w-24" value={r.hsn_code} onChange={(e) => onRow(i, "hsn_code", e.target.value)} />
                  </td>

                  <td className="border px-2 py-1">
                    <input type="number" className="border rounded p-1 w-20" value={r.qty} onChange={(e) => onRow(i, "qty", e.target.value)} />
                  </td>

                  <td className="border px-2 py-1">
                    <input type="number" className="border rounded p-1 w-20" value={r.rate} onChange={(e) => onRow(i, "rate", e.target.value)} />
                  </td>

                  <td className="border px-2 py-1">{fx(c.base)}</td>

                  {/* D1: editable percent */}
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="border rounded p-1 w-16"
                      value={r.d1_percent}
                      onChange={(e) => onRow(i, "d1_percent", e.target.value)}
                    />
                  </td>

                  {/* D2: per-unit amount (read-only) */}
                  <td className="border px-2 py-1">
                    <input type="number" className="border rounded p-1 w-20 bg-gray-100" value={fx(c.perUnitDisc)} readOnly />
                  </td>

                  {/* D3: total discount (read-only) */}
                  <td className="border px-2 py-1">
                    <input type="number" className="border rounded p-1 w-24 bg-gray-100" value={fx(c.totalDisc)} readOnly />
                  </td>

                  {/* Disc column: show total discount as in requirement */}
                  <td className="border px-2 py-1">{fx(c.totalDisc)}</td>

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
        <button type="submit" disabled={loading || productsLoading} className="px-6 py-2 bg-green-700 text-white rounded">
          {loading ? "Saving..." : "Save PO"}
        </button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
