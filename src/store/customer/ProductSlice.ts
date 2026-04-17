import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import type { Product } from "../../types/productTypes";
import type { RootState } from "../index";

const API_URL = "/products";

// ─── Types ────────────────────────────────────────────────────────────────────

// FIX 1: Typed the paginated response instead of using `any`
// Matches Spring Boot's Page<Product> JSON structure
interface PaginatedProducts {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number;       // current page index
  size: number;         // page size
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface ProductState {
  product: Product | null;
  products: Product[];
  paginatedProducts: PaginatedProducts | null;
  totalPages: number;
  loading: boolean;
  error: string | null;
  searchProduct: Product[];
}

// FIX 2: Renamed "color" → "colors" and "size" → "sizes" to match the backend
// controller @RequestParam names. Previously these were sent as "color" and
// "size" but ProductController expects "colors" and "sizes" — so every filter
// request silently sent null to the backend and returned unfiltered results.
interface GetAllProductsParams {
  category?: string;
  brand?: string;
  colors?: string;  // FIX 2a: was "color"
  sizes?: string;   // FIX 2b: was "size"
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  sort?: string;
  stock?: string;
  pageNumber?: number;
}

export interface PurchasedProductQuantity {
  productId: number;
  quantity: number;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: ProductState = {
  product: null,
  products: [],
  paginatedProducts: null,
  totalPages: 1,
  loading: false,
  error: null,
  searchProduct: [],
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchProductById = createAsyncThunk<Product, number>(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get<Product>(`${API_URL}/${productId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? "Failed to fetch product");
    }
  }
);

export const searchProduct = createAsyncThunk<Product[], string>(
  "products/searchProduct",
  async (query, { rejectWithValue }) => {
    try {
      const normalizedQuery = query.trim();
      if (!normalizedQuery) {
        return [];
      }

      const response = await api.get<Product[]>(`${API_URL}/search`, {
        params: { query: normalizedQuery },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? "Failed to search products");
    }
  }
);

export const getAllProducts = createAsyncThunk<PaginatedProducts, GetAllProductsParams>(
  "products/getAllProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get<PaginatedProducts>(API_URL, {
        params: {
          ...params,
          pageNumber: params.pageNumber ?? 0,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? "Failed to fetch products");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    decrementProductQuantitiesAfterPurchase: (
      state,
      action: PayloadAction<PurchasedProductQuantity[]>
    ) => {
      if (!action.payload.length) return;

      const purchasedMap = action.payload.reduce<Record<number, number>>((acc, item) => {
        const productId = Number(item.productId);
        const quantity = Number(item.quantity);
        if (!Number.isFinite(productId) || productId <= 0) return acc;
        if (!Number.isFinite(quantity) || quantity <= 0) return acc;
        acc[productId] = (acc[productId] ?? 0) + quantity;
        return acc;
      }, {});

      const updateProductQuantity = (product: Product): Product => {
        const productId = Number(product?.id);
        if (!productId || !purchasedMap[productId]) return product;

        const nextQuantity = Math.max(0, Number(product.quantity ?? 0) - purchasedMap[productId]);
        return {
          ...product,
          quantity: nextQuantity,
          in_stock: nextQuantity > 0,
        };
      };

      if (state.product) {
        state.product = updateProductQuantity(state.product);
      }

      state.products = state.products.map(updateProductQuantity);
      state.searchProduct = state.searchProduct.map(updateProductQuantity);

      if (state.paginatedProducts) {
        state.paginatedProducts.content = state.paginatedProducts.content.map(updateProductQuantity);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.product = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch product";
      })

      // searchProduct
      .addCase(searchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.searchProduct = [];
      })
      .addCase(searchProduct.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.searchProduct = action.payload;
        state.loading = false;
      })
      .addCase(searchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to search products";
      })

      // getAllProducts
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action: PayloadAction<PaginatedProducts>) => {
        state.paginatedProducts = action.payload;
        state.products = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch products";
      });
  },
});

export default productSlice.reducer;
export const { decrementProductQuantitiesAfterPurchase } = productSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectProduct           = (state: RootState) => state.products.product;
export const selectProducts          = (state: RootState) => state.products.products;
export const selectPaginatedProducts = (state: RootState) => state.products.paginatedProducts;
export const selectTotalPages        = (state: RootState) => state.products.totalPages;
export const selectProductLoading    = (state: RootState) => state.products.loading;
export const selectProductError      = (state: RootState) => state.products.error;
export const selectSearchProducts    = (state: RootState) => state.products.searchProduct;
