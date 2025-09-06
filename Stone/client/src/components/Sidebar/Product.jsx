import React, { useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

const Product = () => {
  const [formData, setFormData] = useState({
    product_name: '',
    sku: '',
    barcode: '',
    category: '',
    brand: '',
    unit: '',
    hsn_code: '',
    tax_percent: '',
    mrp: '',
    purchase_rate: '',
    sales_rate: '',
    qty: '',
    min_qty: '',
    reorder_level: '',
    expiry_date: '',
    supplier: '',
    weight_per_packet: '',
    status: 'Active',
    remark: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    // Submit to backend here
  };

  return (
    <div className="max-w-7xl mx-auto mt-0 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Text Inputs */}
        {[
          ['Product Name', 'product_name'],
          ['SKU', 'sku'],
          ['Barcode', 'barcode'],
          ['Brand', 'brand'],
          ['Unit (e.g., pcs, kg)', 'unit'],
          ['HSN Code', 'hsn_code'],
          ['Tax Percent (%)', 'tax_percent'],
          ['MRP', 'mrp'],
          ['Purchase Rate', 'purchase_rate'],
          ['Sales Rate', 'sales_rate'],
          ['Quantity', 'qty'],
          ['Min Quantity', 'min_qty'],
          ['Reorder Level', 'reorder_level'],
          ['Weight per Packet', 'weight_per_packet'],
        ].map(([label, name]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <TextField
              name={name}
              type={
                name.includes('rate') ||
                name === 'qty' ||
                name.includes('tax') ||
                name.includes('mrp')
                  ? 'number'
                  : 'text'
              }
              value={formData[name]}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </div>
        ))}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <FormControl fullWidth>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="food">Food</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Supplier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <FormControl fullWidth>
            <Select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
            >
              <MenuItem value="supplier1">Supplier 1</MenuItem>
              <MenuItem value="supplier2">Supplier 2</MenuItem>
              <MenuItem value="supplier3">Supplier 3</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <TextField
            name="expiry_date"
            type="date"
            value={formData.expiry_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <FormControl fullWidth>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Remark - full width */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remark
          </label>
          <TextField
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </div>

        {/* Submit Button - full width */}
        <div className="md:col-span-3 text-center mt-4">
          <Button type="submit" variant="contained" color="primary">
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Product;
