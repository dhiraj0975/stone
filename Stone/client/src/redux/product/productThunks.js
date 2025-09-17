import { createAsyncThunk } from "@reduxjs/toolkit";
import ProductAPI from "../../axios/product.API.js";

export const getProducts = createAsyncThunk(
  "products/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await ProductAPI.getAll();
      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (data, thunkAPI) => {
    try {
      const res = await ProductAPI.create(data);
      return res.data?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await ProductAPI.update(id, data);
      return res.data?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      await ProductAPI.delete(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
