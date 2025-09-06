import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';

const PurchaseOrder = () => {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    vendor_id: '',
    product_id: '',
    qty: '',
    rate: '',
    status: 'Pending',
  });

  const [orders, setOrders] = useState([]);

  const total = formData.qty && formData.rate
    ? (parseFloat(formData.qty) * parseFloat(formData.rate)).toFixed(2)
    : '0.00';

  // Mock API fetch
  useEffect(() => {
    setVendors([
      { id: 1, name: 'Vendor A' },
      { id: 2, name: 'Vendor B' },
    ]);

    setProducts([
      { id: 1, name: 'Product X' },
      { id: 2, name: 'Product Y' },
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrder = () => {
    if (!formData.vendor_id || !formData.product_id || !formData.qty || !formData.rate) {
      alert('Please fill all required fields.');
      return;
    }

    const newOrder = {
      ...formData,
      id: Date.now(),
      total,
      vendor_name: vendors.find(v => v.id === parseInt(formData.vendor_id))?.name,
      product_name: products.find(p => p.id === parseInt(formData.product_id))?.name,
    };

    setOrders(prev => [...prev, newOrder]);

    // Reset form
    setFormData({
      vendor_id: '',
      product_id: '',
      qty: '',
      rate: '',
      status: 'Pending',
    });
  };

  const handleToggleForm = () => {
    setShowForm(prev => !prev);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded">
      {/* Toggle Button */}
      <div className="text-center mb-6">
        <Button variant="contained" color="secondary" onClick={handleToggleForm}>
          {showForm ? 'Hide Form' : 'Create Purchase'}
        </Button>
      </div>

      {/* Purchase Form */}
      {showForm && (
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
            <FormControl fullWidth>
              <Select name="vendor_id" value={formData.vendor_id} onChange={handleChange} displayEmpty>
                <MenuItem value="" disabled>Select Vendor</MenuItem>
                {vendors.map(v => (
                  <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <FormControl fullWidth>
              <Select name="product_id" value={formData.product_id} onChange={handleChange} displayEmpty>
                <MenuItem value="" disabled>Select Product</MenuItem>
                {products.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <TextField
              name="qty"
              type="number"
              value={formData.qty}
              onChange={handleChange}
              fullWidth
            />
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
            <TextField
              name="rate"
              type="number"
              value={formData.rate}
              onChange={handleChange}
              fullWidth
            />
          </div>

          {/* Total */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
            <TextField
              name="total"
              value={total}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <FormControl fullWidth>
              <Select name="status" value={formData.status} onChange={handleChange}>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Dispatched">Dispatched</MenuItem>
                <MenuItem value="Received">Received</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Add Button */}
          <div className="md:col-span-3 text-center mt-4">
            <Button variant="contained" color="primary" onClick={handleAddOrder}>
              Add Purchase Order
            </Button>
          </div>
        </form>
      )}

      {/* List of Orders */}
      {orders.length > 0 && (
        <div className="overflow-x-auto mt-10">
          <h3 className="text-xl font-semibold mb-4">Purchase Orders</h3>
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Vendor</th>
                <th className="border px-4 py-2 text-left">Product</th>
                <th className="border px-4 py-2">Qty</th>
                <th className="border px-4 py-2">Rate</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="border px-4 py-2">{order.vendor_name}</td>
                  <td className="border px-4 py-2">{order.product_name}</td>
                  <td className="border px-4 py-2 text-center">{order.qty}</td>
                  <td className="border px-4 py-2 text-center">{order.rate}</td>
                  <td className="border px-4 py-2 text-center">{order.total}</td>
                  <td className="border px-4 py-2 text-center">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;
