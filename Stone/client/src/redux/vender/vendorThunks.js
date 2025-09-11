import { createAsyncThunk } from "@reduxjs/toolkit";
import vendorAPI from "../../axios/vendor.API";

// Create Vendor
export const createVendor = createAsyncThunk(
  "vendor/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await vendorAPI.create(data);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to create vendor");
    }
  }
);

// Get All Vendors
export const getVendors = createAsyncThunk(
  "vendor/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await vendorAPI.getAll();
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch vendors");
    }
  }
);

// Delete Vendor
export const deleteVendor = createAsyncThunk(
  "vendor/delete",
  async (id, { rejectWithValue }) => {
    try {
      await vendorAPI.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to delete vendor");
    }
  }
);

// Update Vendor
export const updateVendor = createAsyncThunk(
  "vendor/update",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const res = await vendorAPI.update(id, data);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to update vendor");
    }
  }
);
