import { createSlice } from "@reduxjs/toolkit";
import { createVendor, getVendors, deleteVendor, updateVendor } from "./vendorThunks";

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    vendors: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors.push(action.payload);
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getVendors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.vendors = state.vendors.filter(
          (v) => (v._id || v.id) !== action.payload
        );
      })

      // Update
      .addCase(updateVendor.fulfilled, (state, action) => {
        const index = state.vendors.findIndex(
          (v) => (v._id || v.id) === (action.payload._id || action.payload.id)
        );
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
      });
  },
});

export const { clearError } = vendorSlice.actions;
export default vendorSlice.reducer;
