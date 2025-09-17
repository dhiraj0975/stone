import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPurchaseOrder } from "../../redux/purchaseOrders/purchaseOrderSlice";
import { getVendors } from "../../redux/vender/vendorThunks";

const PurchaseOrderForm = () => {
  const dispatch = useDispatch();

  // Loaders
  const { loading } = useSelector((state) => state.purchaseOrders);
  const { vendors, loading: vendorsLoading } = useSelector((state) => state.vendor);

  // Header form data
  const [formData, setFormData] = useState({
    po_no: "",
    vendor_id: "",
    date: "",
    bill_date: "",
    address: "",
    mobile_no: "",
    gst_no: "",
    place_of_supply: "",
    terms_condition: "",
  });

// Items table state
const [items, setItems] = useState([
  {
    product_id: "",
    hsn_code: "",
    qty: 1,
    rate: 0,
    discount1: 0,   // पहला डिस्काउंट (Base * %)
    discount2: 0,   // दूसरा डिस्काउंट (Rate * % per qty)
    discount3: 0,   // तीसरा डिस्काउंट (Base * %)
    gst_percent: 0,
  },
]);
  // Fetch vendors on mount
  useEffect(() => {
    dispatch(getVendors());
  }, [dispatch]);

  // Header input change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Item row input change
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = Number(value);
    setItems(newItems);
  };

  // Add new item row
  const addItem = () => {
    setItems([
      ...items,
      { product_id: "", hsn_code: "", qty: 1, rate: 0, discount_per_qty: 0, discount_total: 0, extra_discount: 0, gst_percent: 0 },
    ]);
  };

  // Remove item row
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

 // Calculate totals per item
const calculateItemTotal = (item) => {
  const base = item.qty * item.rate;

  // पहला Discount: % on base
  const discount1 = (base * (item.discount1 || 0)) / 100;

  // दूसरा Discount: per qty * rate based %
  const discount2 =
    ((item.rate * (item.discount2 || 0)) / 100) * item.qty;

  // तीसरा Discount: % on total qty*rate
  const discount3 = (base * (item.discount3 || 0)) / 100;

  const subtotal = base - discount1 - discount2 - discount3;

  const gst = (subtotal * (item.gst_percent || 0)) / 100;

  return {
    discount1,
    discount2,
    discount3,
    gst,
    total: subtotal + gst,
  };
};


 // PO summary
const poSummary = items.reduce(
  (acc, item) => {
    const { discount1, discount2, discount3, gst, total } =
      calculateItemTotal(item);
    acc.totalDiscount += discount1 + discount2 + discount3;
    acc.totalGST += gst;
    acc.totalAmount += total;
    return acc;
  },
  { totalDiscount: 0, totalGST: 0, totalAmount: 0 }
);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemsWithTotals = items.map((item) => {
      const { discount1, discount2, gst, total } = calculateItemTotal(item);
      return { ...item, discount1, discount2, gst_amount: gst, total };
    });
    await dispatch(createPurchaseOrder({ ...formData, items: itemsWithTotals }));

    // Reset form
    setFormData({
      po_no: "",
      vendor_id: "",
      date: "",
      bill_date: "",
      address: "",
      mobile_no: "",
      gst_no: "",
      place_of_supply: "",
      terms_condition: "",
    });
    setItems([{ product_id: "", hsn_code: "", qty: 1, rate: 0, discount_per_qty: 0, discount_total: 0, extra_discount: 0, gst_percent: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold">Create Purchase Order</h2>

      {/* Header Fields */}
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="po_no" placeholder="PO No" value={formData.po_no} onChange={handleChange} className="border p-2 rounded w-full" />

        <select name="vendor_id" value={formData.vendor_id} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
          ))}
        </select>

        <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 rounded w-full" />
        <input type="date" name="bill_date" value={formData.bill_date} onChange={handleChange} className="border p-2 rounded w-full" />
        <input type="text" name="address" value={formData.address} onChange={handleChange} className="border p-2 rounded w-full" />
        <input type="text" name="mobile_no" value={formData.mobile_no} onChange={handleChange} className="border p-2 rounded w-full" />
        <input type="text" name="gst_no" value={formData.gst_no} onChange={handleChange} className="border p-2 rounded w-full" />
        <input type="text" name="place_of_supply" value={formData.place_of_supply} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <textarea name="terms_condition" placeholder="Terms & Conditions" value={formData.terms_condition} onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Items Table */}
      <div>
        <h3 className="font-semibold mb-2">Items</h3>
        <table className="w-full border">
          <thead>
  <tr className="bg-gray-100">
    {[
      "Product ID",
      "HSN Code",
      "Qty",
      "Rate",
      "Disc 1 %",
      "Disc 2 %",
      "Disc 3 %",
      "GST %",
    //   "Disc1 Amt",
    //   "Disc2 Amt",
    //   "Disc3 Amt",
    //   "GST Amt",
    //   "Total",
      "Actions",
    ].map((title) => (
      <th key={title} className="border p-2">{title}</th>
    ))}
  </tr>
</thead>
<tbody>
  {items.map((item, index) => {
    const { discount1, discount2, discount3, gst, total } =
      calculateItemTotal(item);
    return (
      <tr key={index}>
        <td className="border p-2">
          <input type="text" name="product_id" value={item.product_id}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-1 rounded w-full" />
        </td>
        <td className="border p-2">
          <input type="text" name="hsn_code" value={item.hsn_code}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-1 rounded w-full" />
        </td>
        <td className="border p-2">
          <input type="number" name="qty" value={item.qty}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-1 rounded w-full" />
        </td>
        <td className="border p-2">
          <input type="number" name="rate" value={item.rate}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-1 rounded w-full" />
        </td>
        <td className="border p-2">
          <input type="number" name="discount1" value={item.discount1}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-1 rounded w-full" />
        </td>
        <td className="border p-2">
          <input type="number" name="discount2" value={item.discount2}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-1 rounded w-full" />
        </td>
        <td className="border p-2">
          <input type="number" name="discount3" value={item.discount3}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-1 rounded w-full" />
        </td>
        <td className="border p-2">
          <input type="number" name="gst_percent" value={item.gst_percent}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-1 rounded w-full" />
        </td>
        {/* <td className="border p-2">{discount1.toFixed(2)}</td>
        <td className="border p-2">{discount2.toFixed(2)}</td>
        <td className="border p-2">{discount3.toFixed(2)}</td>
        <td className="border p-2">{gst.toFixed(2)}</td>
        <td className="border p-2">{total.toFixed(2)}</td> */}
        <td className="border p-2 text-center">
          <button type="button" onClick={() => removeItem(index)} className="text-red-500">❌</button>
        </td>
      </tr>
    );
  })}
</tbody>

        </table>
        <button type="button" onClick={addItem} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">➕ Add Item</button>
      </div>

      {/* PO Summary */}
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <p>Total Discount: ₹{poSummary.totalDiscount.toFixed(2)}</p>
        <p>Total GST: ₹{poSummary.totalGST.toFixed(2)}</p>
        <p><strong>Final Amount: ₹{poSummary.totalAmount.toFixed(2)}</strong></p>
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading || vendorsLoading} className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center">
        {loading ? "Saving..." : "Save PO"}
      </button>
    </form>
  );
};

export default PurchaseOrderForm;
