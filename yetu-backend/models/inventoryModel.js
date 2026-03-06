const mongoose = require("mongoose");

// Supplier Schema
const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true }, // Kenyan counties/locations
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "InventoryItem" }],
    paymentTerms: { type: String, enum: ["Cash", "M-Pesa", "Bank Transfer", "Credit 7 days", "Credit 14 days", "Credit 30 days"] },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Inventory Item Schema
const inventoryItemSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { 
        type: String, 
        enum: [
            "Proteins", "Vegetables", "Fruits", "Grains", "Spices", 
            "Dairy", "Beverages", "Packaging", "Cleaning", "Other"
        ], 
        required: true 
    },
    unit: { 
        type: String, 
        enum: ["kg", "g", "litre", "ml", "pieces", "bunch", "packet", "box", "bottle"], 
        required: true 
    },
    currentStock: { type: Number, required: true, default: 0 },
    minStock: { type: Number, required: true, default: 0 },
    maxStock: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, required: true, default: 0 },
    costPrice: { type: Number, required: true }, // KES
    sellingPrice: { type: Number, default: 0 }, // KES
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    expiryDate: { type: Date },
    batchNumber: { type: String },
    location: { type: String, enum: ["Dry Store", "Cold Room", "Freezer", "Pantry"] },
    wastePercentage: { type: Number, default: 0 }, // Kenyan food waste average
    isPerishable: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
    priceHistory: [{
        price: Number,
        date: { type: Date, default: Date.now },
        supplier: String
    }]
}, { timestamps: true });

// Waste Tracking Schema
const wasteRecordSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryItem", required: true },
    quantity: { type: Number, required: true },
    reason: { 
        type: String, 
        enum: ["Expired", "Spoilage", "Preparation Waste", "Customer Complaint", "Theft", "Other"] 
    },
    cost: { type: Number, required: true }, // KES lost
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    notes: { type: String }
});

// Purchase Order Schema
const purchaseOrderSchema = new mongoose.Schema({
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    items: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryItem" },
        quantity: Number,
        unitPrice: Number, // KES
        totalPrice: Number // KES
    }],
    totalAmount: { type: Number, required: true }, // KES
    status: { 
        type: String, 
        enum: ["Pending", "Approved", "Received", "Cancelled"], 
        default: "Pending" 
    },
    expectedDeliveryDate: { type: Date },
    receivedDate: { type: Date },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Recipe Costing Schema
const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dishName: { type: String, required: true }, // Links to menu item
    ingredients: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryItem" },
        quantity: Number,
        unit: String
    }],
    preparationTime: { type: Number }, // minutes
    laborCost: { type: Number, default: 0 }, // KES
    overheadCost: { type: Number, default: 0 }, // KES
    totalCost: { type: Number, default: 0 }, // Calculated field
    sellingPrice: { type: Number, required: true }, // KES
    profitMargin: { type: Number, default: 0 }, // Calculated field
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// AI Forecasting Schema
const forecastSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryItem", required: true },
    predictedDemand: { type: Number, required: true },
    confidenceLevel: { type: Number, min: 0, max: 100 }, // AI confidence percentage
    period: { type: String, enum: ["Daily", "Weekly", "Monthly"] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    factors: {
        seasonality: { type: Number, min: 0, max: 100 },
        trends: { type: Number, min: 0, max: 100 },
        promotions: { type: Number, min: 0, max: 100 }
    },
    createdAt: { type: Date, default: Date.now }
});

const Supplier = mongoose.model("Supplier", supplierSchema);
const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);
const WasteRecord = mongoose.model("WasteRecord", wasteRecordSchema);
const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);
const Recipe = mongoose.model("Recipe", recipeSchema);
const Forecast = mongoose.model("Forecast", forecastSchema);

module.exports = {
    Supplier,
    InventoryItem,
    WasteRecord,
    PurchaseOrder,
    Recipe,
    Forecast
};