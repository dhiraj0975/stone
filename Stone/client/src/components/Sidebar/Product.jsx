import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, InputLabel, FormControl, Snackbar,
  TableContainer, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, CircularProgress, IconButton, Typography
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from '../../redux/product/productThunks';

import { clearProductState } from '../../redux/product/productSlice';

const Product = () => {
  const dispatch = useDispatch();
  const { loading, error, success, list } = useSelector((state) => state.product);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    product_name: '', mrp: '', purchase_rate: '', sales_rate: '',
    qty: '', min_qty: '', remark: '', weight_per_packet: '', status: 'Active',
  });

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setOpen(false);
      dispatch(getProducts());
    }
    const timer = setTimeout(() => dispatch(clearProductState()), 3000);
    return () => clearTimeout(timer);
  }, [success, dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openForm = (prod = null) => {
    if (prod) {
      setEditId(prod._id);
      setForm({
        product_name: prod.product_name || '',
        mrp: prod.mrp || '',
        purchase_rate: prod.purchase_rate || '',
        sales_rate: prod.sales_rate || '',
        qty: prod.qty || '',
        min_qty: prod.min_qty || '',
        remark: prod.remark || '',
        weight_per_packet: prod.weight_per_packet || '',
        status: prod.status || 'Active',
      });
    } else {
      setEditId(null);
      setForm({
        product_name: '', mrp: '', purchase_rate: '', sales_rate: '',
        qty: '', min_qty: '', remark: '', weight_per_packet: '', status: 'Active',
      });
    }
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...form,
      mrp: parseFloat(form.mrp),
      purchase_rate: parseFloat(form.purchase_rate),
      sales_rate: parseFloat(form.sales_rate),
      qty: parseInt(form.qty, 10),
      min_qty: parseInt(form.min_qty, 10),
    };

    if (editId) {
      dispatch(updateProduct({ id: editId, data }));
    } else {
      dispatch(createProduct(data));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const closeSnackbar = () => dispatch(clearProductState());

  return (
    <Box maxWidth="lg" mx="auto" mt={4} p={2}>
      <Typography variant="h5" align="center">Product Management</Typography>
      <Box textAlign="center" mb={2}>
        <Button variant="contained" onClick={() => openForm()}>Create Product</Button>
      </Box>

      {/* Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editId ? 'Edit Product' : 'Add Product'}</DialogTitle>

        {/* ✅ Wrap the DialogContent & DialogActions inside a form */}
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box display="grid" gap={2} mt={1} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
              {[
                { name: 'product_name', label: 'Product Name', type: 'text' },
                { name: 'mrp', label: 'MRP', type: 'number' },
                { name: 'purchase_rate', label: 'Purchase Rate', type: 'number' },
                { name: 'sales_rate', label: 'Sales Rate', type: 'number' },
                { name: 'qty', label: 'Quantity', type: 'number' },
                { name: 'min_qty', label: 'Min Quantity', type: 'number' },
                { name: 'weight_per_packet', label: 'Weight Per Packet', type: 'text' },
              ].map((f) => (
                <TextField
                  key={f.name}
                  label={f.label}
                  name={f.name}
                  type={f.type}
                  value={form[f.name]}
                  onChange={handleChange}
                  fullWidth
                  required={['product_name', 'mrp', 'purchase_rate', 'sales_rate', 'qty'].includes(f.name)}
                  disabled={loading}
                />
              ))}

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Remark"
                name="remark"
                value={form.remark}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                disabled={loading}
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : editId ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbars */}
      <Snackbar open={!!success} autoHideDuration={3000} message="Operation successful!" onClose={closeSnackbar} />
      <Snackbar open={!!error} autoHideDuration={4000} message={`Error: ${error}`} onClose={closeSnackbar} />

      {/* Products Table */}
      {loading && !list.length ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>MRP</TableCell>
                <TableCell>Purchase Rate</TableCell>
                <TableCell>Sales Rate</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Min Qty</TableCell>
                <TableCell>Remark</TableCell>
                <TableCell>Weight/Packet</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((prod) => (
                <TableRow key={prod._id}>
                  <TableCell>{prod.product_name}</TableCell>
                  <TableCell>{prod.mrp}</TableCell>
                  <TableCell>{prod.purchase_rate}</TableCell>
                  <TableCell>{prod.sales_rate}</TableCell>
                  <TableCell>{prod.qty}</TableCell>
                  <TableCell>{prod.min_qty}</TableCell>
                  <TableCell>{prod.remark}</TableCell>
                  <TableCell>{prod.weight_per_packet}</TableCell>
                  <TableCell>{prod.status}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => openForm(prod)} disabled={loading}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(prod._id)} disabled={loading}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!list.length && !loading && (
                <TableRow>
                  <TableCell colSpan={10} align="center">No products found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Product;
