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
      setEditId(prod.id); // <-- backend ke id ke hisaab se
      setForm({
        product_name: prod.product_name || '',
        category_id: prod.category_id || '',
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
        product_name: '', category_id: '', mrp: '', purchase_rate: '', sales_rate: '',
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
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box display="grid" gap={2} mt={1} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
              {[ 
                { name: 'product_name', label: 'Product Name', type: 'text' },
                { name: 'category_id', label: 'Category Name', type: 'text' },
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
                <TableCell>Category_id</TableCell>
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
                <TableRow key={prod.id}>
                  <TableCell>{prod.product_name}</TableCell>
                  <TableCell>{prod.category_id}</TableCell>
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
                    <IconButton onClick={() => handleDelete(prod.id)} disabled={loading}><DeleteIcon /></IconButton>
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







// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createProduct,
//   deleteProduct,
//   getProducts,
//   updateProduct,
// } from "../../redux/product/productThunks";
// import { clearProductState } from "../../redux/product/productSlice";

// const Product = () => {
//   const dispatch = useDispatch();
//   const { loading, error, success, list } = useSelector((state) => state.product);

//   const [open, setOpen] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [form, setForm] = useState({
//     product_name: "",
//     mrp: "",
//     purchase_rate: "",
//     sales_rate: "",
//     qty: "",
//     min_qty: "",
//     remark: "",
//     weight_per_packet: "",
//     status: "Active",
//   });

//   useEffect(() => {
//     dispatch(getProducts());
//   }, [dispatch]);

//   useEffect(() => {
//     if (success) {
//       setOpen(false);
//       dispatch(getProducts());
//     }
//     const timer = setTimeout(() => dispatch(clearProductState()), 3000);
//     return () => clearTimeout(timer);
//   }, [success, dispatch]);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const openForm = (prod = null) => {
//     if (prod) {
//       setEditId(prod.id);
//       setForm({
//         product_name: prod.product_name || "",
//         mrp: prod.mrp || "",
//         purchase_rate: prod.purchase_rate || "",
//         sales_rate: prod.sales_rate || "",
//         qty: prod.qty || "",
//         min_qty: prod.min_qty || "",
//         remark: prod.remark || "",
//         weight_per_packet: prod.weight_per_packet || "",
//         status: prod.status || "Active",
//       });
//     } else {
//       setEditId(null);
//       setForm({
//         product_name: "",
//         mrp: "",
//         purchase_rate: "",
//         sales_rate: "",
//         qty: "",
//         min_qty: "",
//         remark: "",
//         weight_per_packet: "",
//         status: "Active",
//       });
//     }
//     setOpen(true);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const data = {
//       ...form,
//       mrp: parseFloat(form.mrp),
//       purchase_rate: parseFloat(form.purchase_rate),
//       sales_rate: parseFloat(form.sales_rate),
//       qty: parseInt(form.qty, 10),
//       min_qty: parseInt(form.min_qty, 10),
//     };

//     if (editId) dispatch(updateProduct({ id: editId, data }));
//     else dispatch(createProduct(data));
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       dispatch(deleteProduct(id));
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto mt-8 p-4">
//       <h2 className="text-2xl font-semibold text-center mb-4">Product Management</h2>

//       <div className="text-center mb-4">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           onClick={() => openForm()}
//         >
//           Create Product
//         </button>
//       </div>

//       {/* Form Modal */}
//       {open && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
//             <h3 className="text-xl font-medium mb-4">{editId ? "Edit Product" : "Add Product"}</h3>
//             <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
//               <input
//                 type="text"
//                 name="product_name"
//                 placeholder="Product Name"
//                 value={form.product_name}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 name="mrp"
//                 placeholder="MRP"
//                 value={form.mrp}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 name="purchase_rate"
//                 placeholder="Purchase Rate"
//                 value={form.purchase_rate}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 name="sales_rate"
//                 placeholder="Sales Rate"
//                 value={form.sales_rate}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 name="qty"
//                 placeholder="Quantity"
//                 value={form.qty}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 name="min_qty"
//                 placeholder="Min Quantity"
//                 value={form.min_qty}
//                 onChange={handleChange}
//                 disabled={loading}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="weight_per_packet"
//                 placeholder="Weight Per Packet"
//                 value={form.weight_per_packet}
//                 onChange={handleChange}
//                 disabled={loading}
//                 className="border p-2 rounded"
//               />
//               <select
//                 name="status"
//                 value={form.status}
//                 onChange={handleChange}
//                 disabled={loading}
//                 className="border p-2 rounded"
//               >
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//               <textarea
//                 name="remark"
//                 placeholder="Remark"
//                 value={form.remark}
//                 onChange={handleChange}
//                 rows={3}
//                 disabled={loading}
//                 className="border p-2 rounded col-span-2"
//               ></textarea>

//               <div className="flex justify-end gap-2 col-span-2 mt-2">
//                 <button
//                   type="button"
//                   className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//                   onClick={() => setOpen(false)}
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600"
//                   disabled={loading}
//                 >
//                   {loading ? "Loading..." : editId ? "Update" : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Table */}
//       {loading && list.length === 0 ? (
//         <div className="text-center mt-4">Loading...</div>
//       ) : (
//         <div className="overflow-x-auto mt-4">
//           <table className="min-w-full border border-gray-300">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border p-2">Product Name</th>
//                 <th className="border p-2">MRP</th>
//                 <th className="border p-2">Purchase Rate</th>
//                 <th className="border p-2">Sales Rate</th>
//                 <th className="border p-2">Qty</th>
//                 <th className="border p-2">Min Qty</th>
//                 <th className="border p-2">Remark</th>
//                 <th className="border p-2">Weight/Packet</th>
//                 <th className="border p-2">Status</th>
//                 <th className="border p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {list.map((prod) => (
//                 <tr key={prod.id} className="text-center">
//                   <td className="border p-2">{prod.product_name}</td>
//                   <td className="border p-2">{prod.mrp}</td>
//                   <td className="border p-2">{prod.purchase_rate}</td>
//                   <td className="border p-2">{prod.sales_rate}</td>
//                   <td className="border p-2">{prod.qty}</td>
//                   <td className="border p-2">{prod.min_qty}</td>
//                   <td className="border p-2">{prod.remark}</td>
//                   <td className="border p-2">{prod.weight_per_packet}</td>
//                   <td className="border p-2">{prod.status}</td>
//                   <td className="border p-2 flex justify-center gap-2">
//                     <button
//                       onClick={() => openForm(prod)}
//                       className="text-blue-500 hover:underline"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(prod.id)}
//                       className="text-red-500 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {list.length === 0 && !loading && (
//                 <tr>
//                   <td colSpan={10} className="text-center p-4">
//                     No products found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Product;
