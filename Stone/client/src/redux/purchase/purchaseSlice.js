import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PurchaseAPI from "../../axios/PurchaseAPI";

// ✅ Thunks
export const fetchPurchases = createAsyncThunk("purchases/fetchAll", async () => {
  const res = await PurchaseAPI.getAll();
  return res.data;
});

export const fetchPurchaseById = createAsyncThunk("purchases/fetchById", async (id) => {
  const res = await PurchaseAPI.getById(id);
  return res.data;
});

export const addPurchase = createAsyncThunk(
  "purchases/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await PurchaseAPI.create(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error while adding purchase");
    }
  }
);

// ✅ Slice
const purchasesSlice = createSlice({
  name: "purchases",
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch by ID
    builder
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.selected = action.payload;
      });

    // Add Purchase
    builder
      .addCase(addPurchase.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload); // naya purchase top pe
      })
      .addCase(addPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelected } = purchasesSlice.actions;
export default purchasesSlice.reducer;
