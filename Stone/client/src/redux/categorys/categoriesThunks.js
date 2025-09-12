import { createAsyncThunk } from "@reduxjs/toolkit";
import categoriesAPI from "../../axios/categories.API";

// Fetch All
export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await categoriesAPI.getAll();
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch");
    }
  }
);

// Add Category
export const addCategory = createAsyncThunk(
  "categories/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await categoriesAPI.create(data);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to add");
    }
  }
);

// Update Category
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const res = await categoriesAPI.update(id, data);
      return res.data?.data ?? res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to update");
    }
  }
);

// Delete Category
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await categoriesAPI.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to delete");
    }
  }
);
