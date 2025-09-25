import React, { useEffect, useMemo, useState } from "react";
import CustomerAPI from "../../axios/CustomersAPI";
import { getProducts } from "../../redux/product/productThunks"; 
import { useDispatch, useSelector } from "react-redux";
import SalesAPI from "../../axios/SalesAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const fx = (n) => (isNaN(n) ? "0.000" : Number(n).toFixed(3));

const SalesForm = ({ sale, onSubmitted }) => {
  const [customers, setCustomers] = useState([]);
const [header, setHeader] = useState({});
const [rows, setRows] = useState([]);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();



const products = useSelector(state => state.product.list); // redux se products
const dispatch = useDispatch(); // dispatch bhi chahiye thunk ke liye



  const isEditMode = Boolean(sale);

useEffect(() => {
  const fetchData = async () => {
    try {
      const customersRes = await CustomerAPI.getAll();
      setCustomers(customersRes.data || []);

      dispatch(getProducts());

      if (isEditMode && sale) {
        // Edit mode: set header from existing sale
        const normalizedDate = sale.date ? new Date(sale.date).toISOString().split("T")[0] : "";
        setHeader({
          ...sale,
          date: normalizedDate,
          bill_time_am_pm: "PM",
           payment_status: sale.payment_status || "Unpaid",
           payment_method: sale.payment_method || "Cash",
        });
        setRows(sale.items?.length ? sale.items : [
          { product_id: "", item_name: "", hsn_code: "", qty: 1, rate: 0, d1_percent: 0, gst_percent: 0 }
        ]);
      } else {
        // New sale: get new sale_no from API
        const res = await SalesAPI.getNewBillNo();
        setHeader({
          sale_no: res.data?.bill_no || "",
          date: "",
          bill_time: "",
          bill_time_am_pm: "PM",
          customer_id: "",
          address: "",
          mobile_no: "",
          gst_no: "",
          terms_condition: "",
        });
        setRows([
          { product_id: "", item_name: "", hsn_code: "", qty: 1, rate: 0, d1_percent: 0, gst_percent: 0 }
        ]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  fetchData();
}, [dispatch, isEditMode, sale]);


  const onHeader = (e) => {
    let value = e.target.value;

    if (e.target.name === "customer_id") {
      value = parseInt(value, 10) || 0;
      const selectedCustomer = customers.find(c => String(c.id) === String(value));
      if (selectedCustomer) {
        setHeader(p => ({
          ...p,
          customer_id: value,
          address: selectedCustomer.address || "",
          mobile_no: selectedCustomer.phone || "",
          gst_no: selectedCustomer.gst_no || "",
          
        }));
        console.log(customersRes.data)
        return;
      }
    }
    setHeader(p => ({ ...p, [e.target.name]: value }));
  };

const onRow = (i, field, value) => {
  setRows(prev => {
    const next = [...prev];
    const numericFields = ["qty", "rate", "d1_percent", "gst_percent", "product_id"];
    next[i] = {
      ...next[i],
      [field]: numericFields.includes(field) ? (value === "" ? 0 : Number(value)) : value,
    };
    if (field === "product_id") {
      const product = products.find(p => String(p.id) === String(value));
      next[i].item_name = product?.product_name || "";
      next[i].hsn_code = product?.hsn_code || "";
      next[i].rate = product?.sales_rate || 0; // ✅ Sale rate auto-fill
    }
    return next;
  });
};


  const addRow = () => setRows(p => [...p, { product_id: "", item_name: "", hsn_code: "", qty: 1, rate: 0, d1_percent: 0, gst_percent: 0 }]);
  const removeRow = (i) => setRows(p => p.filter((_, idx) => idx !== i));

  const calc = (r) => {
    const base = (Number(r.qty) || 0) * (Number(r.rate) || 0);
    const perUnitDisc = ((Number(r.rate) || 0) * (Number(r.d1_percent) || 0)) / 100;
    const totalDisc = (Number(r.qty) || 0) * perUnitDisc;
    const taxable = Math.max(base - totalDisc, 0);
    const gstAmt = (taxable * (Number(r.gst_percent) || 0)) / 100;
    const final = taxable + gstAmt;
    return { base, perUnitDisc, totalDisc, taxable, gstAmt, final };
  };

  const totals = useMemo(() => rows.reduce((a, r) => {
    const c = calc(r);
    a.base += c.base;
    a.disc += c.totalDisc;
    a.taxable += c.taxable;
    a.gst += c.gstAmt;
    a.final += c.final;
    return a;
  }, { base: 0, disc: 0, taxable: 0, gst: 0, final: 0 }), [rows]);

  const isFormValid = useMemo(() => {
    if (!header || !rows || rows.length === 0) return false;
    const headerValid = header.sale_no && String(header.sale_no).trim() !== "" && header.customer_id && Number(header.customer_id) > 0;
    const rowsValid = rows.every(r => r.product_id && Number(r.product_id) > 0 && Number(r.qty) > 0 && Number(r.rate) > 0);
    return Boolean(headerValid && rowsValid);
  }, [header, rows]);




// function ke andar


const onSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);

    const payload = {
      customer_id: header.customer_id,
      bill_no: header.sale_no,
      bill_date: header.date,
      status: header.status || 'Active',
      payment_status: header.payment_status || 'Unpaid',
      payment_method: header.payment_method || 'Cash',
      remarks: header.remarks || header.terms_condition || '',
    items: rows.map(r => ({
  product_id: r.product_id,
  qty: r.qty,
  discount_rate: r.d1_percent || 0,
  gst_percent: r.gst_percent || 0, // ✅ add this
  unit: r.unit || 'PCS'
}))

      
    };
    console.log(JSON.stringify(payload, null, 2));


    if (isEditMode) {
      await SalesAPI.update(sale.id, payload);
      toast.success("Sale updated successfully!");
    } else {
      await SalesAPI.create(payload);
      toast.success("Sale created successfully!");
    }

    // ✅ Reset form
    setHeader({
      sale_no: "",
      date: "",
      bill_time: "",
      bill_time_am_pm: "PM",
      customer_id: "",
      address: "",
      mobile_no: "",
      gst_no: "",
      terms_condition: "",
        payment_status: "Unpaid",   // 👈 default
        payment_method: "Cash",     // 👈 default
    });
    setRows([{ product_id: "", item_name: "", hsn_code: "", qty: 1, rate: 0, d1_percent: 0, gst_percent: 0 }]);

    // ✅ Navigate to sales list
    if (onSubmitted) onSubmitted();  // optional callback
    navigate("/sales"); // ya jo route aapke list ka hai
  } catch (err) {
    console.error("Failed to save sale:", err);
    toast.error("Failed to save sale");
  } finally {
    setLoading(false);
  }
};



  return (
    <form onSubmit={onSubmit} className="p-3">
      <div className="grid grid-cols-6 gap-3 border p-3 rounded">
        <div className="flex flex-col">
          <label className="text-xs">Sale No.</label>
<input className="border rounded p-1" name="bill_no" value={header.sale_no} onChange={onHeader} />
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
          <label className="text-xs">Customer</label>
          <select className="border rounded p-1" name="customer_id" value={header.customer_id} onChange={onHeader}>
            <option value="">Select</option>
            {customers.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs">Address</label>
          <input className="border rounded p-1" name="address" value={header.address} onChange={onHeader} />
        </div>
        <div className="flex flex-col">
          <label className="text-xs">Mobile</label>
          <input className="border rounded p-1" name="mobile_no" value={header.mobile_no} onChange={onHeader} />
        </div>
        <div className="flex flex-col">
          <label className="text-xs">GST No</label>
          <input className="border rounded p-1" name="gst_no" value={header.gst_no} onChange={onHeader} />
        </div>
        <div className="flex flex-col">
  <label className="text-xs">Payment Status</label>
  <select
    className="border rounded p-1"
    name="payment_status"
    value={header.payment_status || ""}
    onChange={onHeader}
  >
    <option value="Unpaid">Unpaid</option>
    <option value="Paid">Paid</option>
    <option value="Partial">Partial</option>
  </select>
</div>

<div className="flex flex-col">
  <label className="text-xs">Payment Method</label>
  <select
    className="border rounded p-1"
    name="payment_method"
    value={header.payment_method || ""}
    onChange={onHeader}
  >
    <option value="Cash">Cash</option>
    <option value="Card">Card</option>
    <option value="Online">Online</option>
    <option value="UPI">UPI</option>
  </select>
</div>

        <div className="flex flex-col col-span-2">
          <label className="text-xs">Terms</label>
          <input className="border rounded p-1" name="terms_condition" value={header.terms_condition} onChange={onHeader} />
        </div>
      </div>

      <div className="bg-black text-yellow-300 text-center text-2xl font-semibold py-2 mt-3 mb-2 rounded">
        FINAL AMOUNT: {fx(totals.final)}
      </div>

      {/* Items Table */}
      <div className="overflow-auto">
        <table className="w-full text-sm border">
          <thead className="bg-green-700 text-white">
            <tr>
              {["SI", "Item Name", "HSNCode", "Qty", "Rate", "Amount", "Disc %", "per qty Disc", "Disc", "GST%", "GST Amt", "FinalAmt", "Actions"].map((h, idx) => <th key={idx} className="border px-2 py-1">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const c = calc(r);
              return (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-2 py-1">{i+1}</td>
                  <td className="border px-2 py-1">
                    <select className="border rounded p-1 w-44" value={r.product_id} onChange={(e) => onRow(i, "product_id", e.target.value)}>
                      <option value="">Select</option>
                      {products.map(p => <option key={p.id} value={String(p.id)}>{p.product_name}</option>)}
                    </select>
                  </td>
                  <td className="border px-2 py-1"><input readOnly className="border cursor-not-allowed bg-gray-100 rounded p-1 w-24" value={r.hsn_code} /></td>
                  <td className="border px-2 py-1"><input type="number" className="border rounded p-1 w-20" value={r.qty} onChange={e => onRow(i, "qty", e.target.value)} /></td>
                  <td className="border px-2 py-1"><input type="number" readOnly className="border cursor-not-allowed bg-gray-100 rounded p-1 w-20" value={r.rate} onChange={e => onRow(i, "rate", e.target.value)} /></td>
                  <td className="border px-2 py-1">{fx(c.base)}</td>
                  <td className="border px-2 py-1"><input type="number" className="border rounded p-1 w-16" value={r.d1_percent} onChange={e => onRow(i, "d1_percent", e.target.value)} /></td>
                  <td className="border px-2 py-1"><input type="number" className="border rounded p-1 w-20 bg-gray-100" value={fx(c.perUnitDisc)} readOnly /></td>
                  <td className="border px-2 py-1"><input type="number" className="border rounded p-1 w-24 bg-gray-100" value={fx(c.totalDisc)} readOnly /></td>
                  <td className="border px-2 py-1"><input type="number" className="border rounded p-1 w-16" value={r.gst_percent} onChange={e => onRow(i, "gst_percent", e.target.value)} /></td>
                  <td className="border px-2 py-1">{fx(c.gstAmt)}</td>
                  <td className="border px-2 py-1">{fx(c.final)}</td>
                  <td className="border px-2 py-1 text-center">
                    <button type="button" className="text-red-600" onClick={() => removeRow(i)}>❌</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td colSpan={5} className="border px-2 py-1">Totals</td>
              <td className="border px-2 py-1">{fx(totals.base)}</td>
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
        <button type="button" onClick={addRow} className="px-4 py-2 bg-blue-600 text-white rounded">Add Item</button>
        <button type="submit" disabled={loading || !isFormValid} className={`px-6 py-2 rounded text-white bg-green-700 ${loading || !isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}>
          {loading ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update Sale" : "Save Sale"}
        </button>
      </div>
    </form>
  )
};

export default SalesForm;
