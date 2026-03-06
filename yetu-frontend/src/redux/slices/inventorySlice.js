import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
    addInventoryItem as addInventoryItemAPI,
    getInventoryItems as getInventoryItemsAPI,
    updateInventoryStock as updateInventoryStockAPI,
    addSupplier as addSupplierAPI,
    getSuppliers as getSuppliersAPI,
    createPurchaseOrder as createPurchaseOrderAPI,
    getReorderSuggestions as getReorderSuggestionsAPI,
    getInventoryOverview as getInventoryOverviewAPI,
    getWasteAnalysis as getWasteAnalysisAPI
} from "../../https/inventoryAPI";

// Async Thunks

// Inventory Items
export const fetchInventoryItems = createAsyncThunk(
    "inventory/fetchItems",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await getInventoryItemsAPI(filters);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addInventoryItem = createAsyncThunk(
    "inventory/addItem",
    async (itemData, { rejectWithValue }) => {
        try {
            const response = await addInventoryItemAPI(itemData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateStock = createAsyncThunk(
    "inventory/updateStock",
    async ({ itemId, data }, { rejectWithValue }) => {
        try {
            const response = await updateInventoryStockAPI(itemId, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Suppliers
export const fetchSuppliers = createAsyncThunk(
    "inventory/fetchSuppliers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getSuppliersAPI();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addSupplier = createAsyncThunk(
    "inventory/addSupplier",
    async (supplierData, { rejectWithValue }) => {
        try {
            const response = await addSupplierAPI(supplierData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Purchase Orders
export const createPurchaseOrder = createAsyncThunk(
    "inventory/createPurchaseOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await createPurchaseOrderAPI(orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Analytics
export const fetchReorderSuggestions = createAsyncThunk(
    "inventory/fetchReorderSuggestions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getReorderSuggestionsAPI();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchWasteAnalysis = createAsyncThunk(
    "inventory/fetchWasteAnalysis",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await getWasteAnalysisAPI(filters);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchInventoryOverview = createAsyncThunk(
    "inventory/fetchOverview",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getInventoryOverviewAPI();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    items: [],
    suppliers: [],
    reorderSuggestions: [],
    wasteAnalysis: {
        totalWasteCost: 0,
        totalWasteQuantity: 0,
        wasteByReason: {},
        records: []
    },
    loading: false,
    error: null,
    lowStockItems: [],
    aiInsights: [],
    overview: {
        totalItems: 0,
        totalStockValue: 0,
        lowStock: 0,
        outOfStock: 0,
        totalWasteCost: 0,
        totalWasteQuantity: 0,
        pendingPurchaseOrders: 0,
        categoryBreakdown: []
    }
};

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearInventoryData: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Inventory Items
            .addCase(fetchInventoryItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInventoryItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data || [];
                state.lowStockItems = state.items.filter(item => 
                    item.currentStock <= item.reorderLevel
                );
            })
            .addCase(fetchInventoryItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Inventory Item
            .addCase(addInventoryItem.fulfilled, (state, action) => {
                if (action.payload?.data?.inventoryItem) {
                    state.items.push(action.payload.data.inventoryItem);
                }
            })
            .addCase(addInventoryItem.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Update Stock
            .addCase(updateStock.fulfilled, (state, action) => {
                const updatedItem = action.payload?.data;
                const index = state.items.findIndex(item => item._id === updatedItem?._id);
                if (index !== -1) {
                    state.items[index] = updatedItem;
                }
            })
            .addCase(updateStock.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Fetch Suppliers
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
                state.suppliers = action.payload.data || [];
            })
            .addCase(fetchSuppliers.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Add Supplier
            .addCase(addSupplier.fulfilled, (state, action) => {
                if (action.payload?.data) {
                    state.suppliers.push(action.payload.data);
                }
            })
            .addCase(addSupplier.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Fetch Reorder Suggestions
            .addCase(fetchReorderSuggestions.fulfilled, (state, action) => {
                state.reorderSuggestions = action.payload.data || [];
            })
            .addCase(fetchReorderSuggestions.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Fetch Waste Analysis
            .addCase(fetchWasteAnalysis.fulfilled, (state, action) => {
                state.wasteAnalysis = action.payload.data || initialState.wasteAnalysis;
            })
            .addCase(fetchWasteAnalysis.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Fetch Overview
            .addCase(fetchInventoryOverview.fulfilled, (state, action) => {
                state.overview = action.payload.data || initialState.overview;
            })
            .addCase(fetchInventoryOverview.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { clearError, clearInventoryData } = inventorySlice.actions;
export default inventorySlice.reducer;

// Selectors
export const selectInventoryItems = (state) => state.inventory.items;
export const selectLowStockItems = (state) => state.inventory.lowStockItems;
export const selectSuppliers = (state) => state.inventory.suppliers;
export const selectReorderSuggestions = (state) => state.inventory.reorderSuggestions;
export const selectWasteAnalysis = (state) => state.inventory.wasteAnalysis;
export const selectInventoryOverview = (state) => state.inventory.overview;
export const selectInventoryLoading = (state) => state.inventory.loading;
export const selectInventoryError = (state) => state.inventory.error;
