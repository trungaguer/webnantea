import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ProductService from "../../services/ProductService";

// ================= ASYNC THUNK =================

// 🔥 GET ALL PRODUCT
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params, thunkAPI) => {
    try {
      const res = await ProductService.getAllProduct(params);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || "Fetch product failed",
      );
    }
  },
);

// ================= INITIAL STATE =================
const initialState = {
  products: [],
  total: 0,
  page: 1,
  totalPage: 1,

  search: "",
  category: "",
  sort: "",

  isLoading: false,
  error: null,
};

// ================= SLICE =================
export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // 🔍 SEARCH
    searchProduct: (state, action) => {
      state.search = action.payload.trim();
      state.page = 1; // reset page
    },

    clearSearch: (state) => {
      state.search = "";
      state.page = 1;
    },

    // 📂 CATEGORY
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1;
    },

    // 🔄 SORT
    setSort: (state, action) => {
      state.sort = action.payload;
    },

    // 📄 PAGINATION
    setPage: (state, action) => {
      state.page = action.payload;
    },

    // 🔄 RESET FILTER
    resetFilter: (state) => {
      state.search = "";
      state.category = "";
      state.sort = "";
      state.page = 1;
    },
  },

  extraReducers: (builder) => {
    builder
      // ⏳ LOADING
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // ✅ SUCCESS
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;

        state.products = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPage = action.payload.totalPage;
      })

      // ❌ ERROR
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// ================= EXPORT =================
export const {
  searchProduct,
  clearSearch,
  setCategory,
  setSort,
  setPage,
  resetFilter,
} = productSlice.actions;

export default productSlice.reducer;
