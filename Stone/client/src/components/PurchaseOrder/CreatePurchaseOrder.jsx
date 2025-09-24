import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createPurchaseOrder, updatePurchaseOrder } from '../../redux/purchaseOrders/purchaseOrderSlice';
import { getProducts } from '../../redux/product/productThunks';
import { getVendors } from '../../redux/vender/vendorThunks';

const CreatePurchaseOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEditMode = Boolean(id);
  const { po: existingPO } = location.state || {};

  const { list: products } = useSelector((state) => state.product);
  const { vendors } = useSelector((state) => state.vendor);

  const [formData, setFormData] = useState({
    vendor_id: '',
    date: new Date().toISOString().split('T')[0],
    items: [{ product_id: '', qty: 1, rate: 0 }],
  });

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getVendors());

    if (isEditMode && existingPO) {
      setFormData({
        ...existingPO,
        date: existingPO.date ? new Date(existingPO.date).toISOString().split('T')[0] : '',
      });
    }
  }, [dispatch, isEditMode, existingPO]);

  const handleHeaderChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, e) => {
    const updatedItems = [...formData.items];
    updatedItems[index][e.target.name] = e.target.value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', qty: 1, rate: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      dispatch(updatePurchaseOrder({ id, data: formData }));
    } else {
      dispatch(createPurchaseOrder(formData));
    }
    navigate('/purchase-orders');
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-bold mb-4">
        {isEditMode ? 'Edit Purchase Order' : 'Create Purchase Order'}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label>Vendor</label>
            <select name="vendor_id" value={formData.vendor_id} onChange={handleHeaderChange} className="w-full p-2 border rounded" required>
              <option value="">Select Vendor</option>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleHeaderChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        {/* Items */}
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2 items-end">
            <div className="md:col-span-2">
              <label>Product</label>
              <select name="product_id" value={item.product_id} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 border rounded" required>
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.product_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Quantity</label>
              <input type="number" name="qty" value={item.qty} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>Rate</label>
              <input type="number" name="rate" value={item.rate} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 border rounded" />
            </div>
            <button type="button" onClick={() => removeItem(index)} className="bg-red-500 text-white p-2 rounded">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="bg-blue-500 text-white p-2 rounded mb-4">Add Item</button>

        {/* Submit */}
        <div className="flex justify-end">
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            {isEditMode ? 'Update PO' : 'Create PO'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchaseOrder;
