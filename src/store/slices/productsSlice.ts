import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getProducts, getProductsByCategory, searchProducts, type Product } from "../../api/productApi";

export type SortOption =
  | "Most Popular"
  | "Newest"
  | "Top Rated"
  | "Price: Low to High"
  | "Price: High to Low";

export interface FilterState {
  priceRange: [number, number];
  selectedColors: string[];
  selectedSizes: string[];
  selectedStyles: string[];
  selectedCategory: string;
  minRating: number;
  searchQuery: string;
}

export const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 1500],
  selectedColors: [],
  selectedSizes: [],
  selectedStyles: [],
  selectedCategory: "",
  minRating: 0,
  searchQuery: "",
};

interface ProductsState {
  all: Product[];
  status: "idle" | "loading" | "error";
  filters: FilterState;
  sortBy: SortOption;
  page: number;
}

const initialState: ProductsState = {
  all: [],
  status: "idle",
  filters: DEFAULT_FILTERS,
  sortBy: "Most Popular",
  page: 1,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async () => (await getProducts(100)).products
);

export const fetchByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (category: string) => (await getProductsByCategory(category)).products
);

export const fetchBySearch = createAsyncThunk(
  "products/fetchBySearch",
  async (query: string) => (await searchProducts(query)).products
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<FilterState>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    resetFilters(state) {
      state.filters = DEFAULT_FILTERS;
      state.page = 1;
    },
    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    const loading = (state: ProductsState) => { state.status = "loading"; };
    const error   = (state: ProductsState) => { state.status = "error"; };
    builder
      .addCase(fetchProducts.pending,     loading)
      .addCase(fetchProducts.rejected,    error)
      .addCase(fetchProducts.fulfilled,   (s, a) => { s.all = a.payload; s.status = "idle"; })
      .addCase(fetchByCategory.pending,   loading)
      .addCase(fetchByCategory.rejected,  error)
      .addCase(fetchByCategory.fulfilled, (s, a) => { s.all = a.payload; s.status = "idle"; })
      .addCase(fetchBySearch.pending,     loading)
      .addCase(fetchBySearch.rejected,    error)
      .addCase(fetchBySearch.fulfilled,   (s, a) => { s.all = a.payload; s.status = "idle"; });
  },
});

export const { setFilters, resetFilters, setSortBy, setPage } = productsSlice.actions;
export default productsSlice.reducer;
