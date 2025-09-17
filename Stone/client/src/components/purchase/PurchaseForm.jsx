import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPurchase } from "../../redux/purchase/purchaseSlice";
import VendorAPI from "../../axios/vendor.API";
import ProductAPI from "../../axios/product.API";

export default function PurchaseForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.purchases);

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    vendor_id: "",
    bill_no: "",
    bill_date: "",
    total_amount: 0,
    items: [],
  });

  // ✅ Load Vendors + Products on mount
useEffect(() => {
  // Vendors
  VendorAPI.getAll()
    .then((res) => {
      console.log("Vendors fetched:", res.data);
      setVendors(Array.isArray(res.data) ? res.data : res.data.data || []);
    })
    .catch((err) => console.error(err));

  // Products
  ProductAPI.getAll()
    .then((res) => {
      console.log("Products fetched:", res.data);
      setProducts(Array.isArray(res.data) ? res.data : res.data.data || []);
    })
    .catch((err) => console.error(err));
}, []);


  // ✅ Add new item row
  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { product_id: "", rate: 0, qty: 1, unit: "PCS", total: 0 },
      ],
    }));
  };

  // ✅ Handle item change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    // auto-calc total
    updatedItems[index].total =
      parseFloat(updatedItems[index].rate || 0) *
      parseFloat(updatedItems[index].qty || 0);

    // update total amount
    const total_amount = updatedItems.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );

    setFormData({ ...formData, items: updatedItems, total_amount });
  };

  // ✅ Submit
  const handleSubmit = (e) => {
    e.preventDefault();
     console.log("Submitting purchase:", formData); // ✅ check format
    dispatch(addPurchase(formData));
    setFormData({
      vendor_id: "",
      bill_no: "",
      bill_date: "",
      total_amount: 0,
      items: [],
    });
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">New Purchase</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vendor */}
{/* Vendors */}
<select
  className="w-full border p-2 rounded"
  value={formData.vendor_id}
  onChange={(e) =>
    setFormData({ ...formData, vendor_id: e.target.value })
  }
  required
>
  <option value="">-- Select Vendor --</option>
  {vendors.map((v) => (
    <option key={v.id} value={v.id}>
      {v.vendor_name || v.name} ({v.firm_name})
    </option>
  ))}
</select>

{/* Products */}
  {/* <select
    className="border p-2 rounded"
    value={item.product_id}
    onChange={(e) =>
      handleItemChange(index, "product_id", e.target.value)
    }
  >
    <option value="">-- Select Product --</option>
    {products.map((p) => (
      <option key={p.id} value={p.id}>
        {p.product_name}
      </option>
    ))} */}
{/* </select> */}


        {/* Bill No & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Bill No</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={formData.bill_no}
              onChange={(e) =>
                setFormData({ ...formData, bill_no: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-1">Bill Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={formData.bill_date}
              onChange={(e) =>
                setFormData({ ...formData, bill_date: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Items */}
{/* Items */}
{/* Items */}
<div>
  <label className="block mb-2 font-semibold">Items</label>
  {formData.items.map((item, index) => (
    <div key={index} className="grid grid-cols-5 gap-2 mb-4 items-start">
      
      {/* Product */}
      <select
        className="border p-2 rounded w-full"
        value={item.product_id}
        onChange={(e) =>
          handleItemChange(index, "product_id", e.target.value)
        }
      >
        <option value="">-- Select Product --</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.product_name}
          </option>
        ))}
      </select>

      {/* Rate */}
      <input
        type="number"
        className="border p-2 rounded w-full"
        placeholder="Rate"
        value={item.rate}
        onChange={(e) =>
          handleItemChange(index, "rate", e.target.value)
        }
      />

      {/* Qty */}
      <input
        type="number"
        className="border p-2 rounded w-full"
        placeholder="Qty"
        value={item.qty}
        onChange={(e) =>
          handleItemChange(index, "qty", e.target.value)
        }
      />

      {/* Unit */}
      <select
        className="border p-2 rounded w-full"
        value={item.unit}
        onChange={(e) =>
          handleItemChange(index, "unit", e.target.value)
        }
      >
        <option value="PCS">PCS</option>
        <option value="KG">KG</option>
        <option value="GM">GM</option>
        <option value="LTR">LTR</option>
      </select>

      {/* Total */}
      <input
        type="number"
        className="border p-2 rounded w-full bg-gray-100"
        value={item.total}
        readOnly
      />
    </div>
  ))}

  <button
    type="button"
    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
    onClick={addItemRow}
  >
    + Add Item
  </button>
</div>




        {/* Total Amount */}
        <div>
          <label className="block mb-1">Total Amount</label>
          <input
            type="number"
            className="w-full border p-2 rounded bg-gray-100"
            value={formData.total_amount}
            readOnly
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Purchase"}
        </button>
      </form>
    </div>
  );
} 