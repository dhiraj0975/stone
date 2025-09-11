// src/redux/product/productSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createProduct, deleteProduct, getProducts, updateProduct } from './productThunks';


const initialState = {
  list: [],
  loading: false,
  error: null,
  success: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getProducts.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(getProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createProduct.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(createProduct.fulfilled, (state, action) => { state.loading = false; state.list.push(action.payload); state.success = true; })
      .addCase(createProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateProduct.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(deleteProduct.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((p) => p._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
