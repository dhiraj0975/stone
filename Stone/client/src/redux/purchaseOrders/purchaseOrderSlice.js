import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PurchaseOrderAPI from "../../axios/PurchaseOrderAPI";

// ✅ Async Thunks
export const fetchPurchaseOrders = createAsyncThunk(
  "purchaseOrders/fetchAll",
  async () => {
    const res = await PurchaseOrderAPI.getAll();
    return res.data;
  }
);

export const fetchPurchaseOrderById = createAsyncThunk(
  "purchaseOrders/fetchById",
  async (id) => {
    const res = await PurchaseOrderAPI.getById(id);
    return res.data;
  }
);

export const createPurchaseOrder = createAsyncThunk(
  "purchaseOrders/create",
  async (data) => {
    const res = await PurchaseOrderAPI.create(data);
    return res.data;
  }
);

export const deletePurchaseOrder = createAsyncThunk(
  "purchaseOrders/delete",
  async (id) => {
    await PurchaseOrderAPI.delete(id);
    return id; // return deleted ID
  }
);

// ✅ Slice
const purchaseOrderSlice = createSlice({
  name: "purchaseOrders",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPO: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch By ID
      .addCase(fetchPurchaseOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchPurchaseOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      .addCase(createPurchaseOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.list = state.list.filter((po) => po.id !== action.payload);
      });
  },
});

export const { clearCurrentPO } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
