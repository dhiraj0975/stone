import { createSlice } from "@reduxjs/toolkit";
import { createVendor, getVendors, deleteVendor } from "./vendorThunks";

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
      // Create Vendor
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors.push(action.payload); // ✅ return ke andar data hai
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Vendors
      .addCase(getVendors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(getVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Vendor
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.vendors = state.vendors.filter((v) => v.id !== action.payload);
      });
  },
});

export const { clearError } = vendorSlice.actions;
export default vendorSlice.reducer;
