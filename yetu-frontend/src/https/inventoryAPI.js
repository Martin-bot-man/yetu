import { axiosWrapper } from "./axiosWrapper";

// Inventory Items API
export const addInventoryItem = (data) => axiosWrapper.post("/api/inventory/items", data);
export const getInventoryItems = (filters) => axiosWrapper.get("/api/inventory/items", { params: filters });
export const updateInventoryStock = (itemId, data) => axiosWrapper.put(`/api/inventory/items/${itemId}/stock`, data);

// Suppliers API
export const addSupplier = (data) => axiosWrapper.post("/api/inventory/suppliers", data);
export const getSuppliers = () => axiosWrapper.get("/api/inventory/suppliers");

// Purchase Orders API
export const createPurchaseOrder = (data) => axiosWrapper.post("/api/inventory/purchase-orders", data);

// Analytics API
export const getReorderSuggestions = () => axiosWrapper.get("/api/inventory/analytics/reorder-suggestions");
export const getInventoryOverview = () => axiosWrapper.get("/api/inventory/analytics/overview");
export const getWasteAnalysis = (filters) => axiosWrapper.get("/api/inventory/analytics/waste-analysis", { params: filters });
