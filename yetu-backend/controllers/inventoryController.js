const createHttpError = require("http-errors");
const { InventoryItem, Supplier, WasteRecord, PurchaseOrder, Recipe, Forecast } = require("../models/inventoryModel");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");

// AI-Powered Demand Forecasting
const calculateDemandForecast = async (itemId, days = 30) => {
    try {
        const item = await InventoryItem.findById(itemId);
        if (!item) throw createHttpError(404, "Inventory item not found");

        // Get historical order data for this item
        const orders = await Order.find({
            "items.name": item.name,
            createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
        }).sort({ createdAt: 1 });

        if (orders.length === 0) {
            // Default forecast for new items
            return {
                predictedDemand: item.minStock,
                confidenceLevel: 50,
                factors: { seasonality: 0, trends: 0, promotions: 0 }
            };
        }

        // Calculate average daily consumption
        let totalConsumed = 0;
        let daysWithData = new Set();
        
        orders.forEach(order => {
            const itemInOrder = order.items.find(i => i.name === item.name);
            if (itemInOrder) {
                totalConsumed += itemInOrder.quantity;
                daysWithData.add(order.createdAt.toDateString());
            }
        });

        const avgDailyConsumption = totalConsumed / Math.max(daysWithData.size, 1);
        
        // Apply Kenyan market factors
        const seasonalityFactor = getSeasonalityFactor();
        const trendFactor = getTrendFactor(orders);
        const promotionFactor = getPromotionFactor();

        const adjustedDemand = avgDailyConsumption * seasonalityFactor * trendFactor * promotionFactor;
        
        // Calculate confidence based on data availability
        const confidence = Math.min(90, (daysWithData.size / days) * 100);

        return {
            predictedDemand: Math.ceil(adjustedDemand * 7), // Weekly forecast
            confidenceLevel: Math.round(confidence),
            factors: {
                seasonality: Math.round(seasonalityFactor * 100),
                trends: Math.round(trendFactor * 100),
                promotions: Math.round(promotionFactor * 100)
            }
        };
    } catch (error) {
        throw error;
    }
};

// Kenyan Seasonal Factors
const getSeasonalityFactor = () => {
    const month = new Date().getMonth();
    // Higher demand during holidays and weekends
    const holidayFactors = {
        0: 1.2, // January (New Year)
        4: 1.3, // May (Labour Day)
        7: 1.4, // August (Madaraka Day)
        10: 1.5, // November (Mashujaa Day)
        11: 1.6  // December (Christmas/Holidays)
    };
    
    return holidayFactors[month] || 1.0;
};

const getTrendFactor = (orders) => {
    if (orders.length < 7) return 1.0;
    
    // Calculate trend over last 2 weeks
    const recentOrders = orders.slice(-14);
    const oldOrders = orders.slice(0, -14);
    
    if (oldOrders.length === 0) return 1.0;
    
    const recentAvg = calculateAverageConsumption(recentOrders);
    const oldAvg = calculateAverageConsumption(oldOrders);
    
    return recentAvg / oldAvg;
};

const getPromotionFactor = () => {
    // Check if there are active promotions
    // For now, return neutral factor
    return 1.0;
};

const calculateAverageConsumption = (orders) => {
    let total = 0;
    orders.forEach(order => {
        order.items.forEach(item => {
            total += item.quantity;
        });
    });
    return total / orders.length;
};

// Inventory Management Controllers

// Add new inventory item
const addInventoryItem = async (req, res, next) => {
    try {
        const { name, category, unit, currentStock, minStock, maxStock, costPrice, sellingPrice, supplier, expiryDate, location, isPerishable } = req.body;

        const existingItem = await InventoryItem.findOne({ name });
        if (existingItem) {
            const error = createHttpError(400, "Inventory item already exists");
            return next(error);
        }

        const inventoryItem = new InventoryItem({
            name,
            category,
            unit,
            currentStock,
            minStock,
            maxStock,
            reorderLevel: Math.ceil(minStock * 0.8), // 80% of min stock
            costPrice,
            sellingPrice,
            supplier,
            expiryDate,
            location,
            isPerishable,
            wastePercentage: isPerishable ? 15 : 5 // Kenyan average waste percentages
        });

        await inventoryItem.save();
        
        // Generate initial forecast
        const forecastData = await calculateDemandForecast(inventoryItem._id);
        const forecast = new Forecast({
            item: inventoryItem._id,
            predictedDemand: forecastData.predictedDemand,
            confidenceLevel: forecastData.confidenceLevel,
            period: "Weekly",
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            factors: forecastData.factors
        });
        await forecast.save();

        res.status(201).json({
            success: true,
            message: "Inventory item added successfully",
            data: { inventoryItem, forecast }
        });
    } catch (error) {
        next(error);
    }
};

// Get inventory items with AI suggestions
const getInventoryItems = async (req, res, next) => {
    try {
        const { category, lowStock, sortBy = "currentStock", order = "asc" } = req.query;
        
        const query = { isActive: true };
        if (category) query.category = category;
        if (lowStock === "true") {
            query.$expr = { $lte: ["$currentStock", "$reorderLevel"] };
        }

        const validSortFields = ["name", "currentStock", "costPrice", "category", "lastUpdated"];
        const safeSortBy = validSortFields.includes(sortBy) ? sortBy : "currentStock";
        const safeOrder = order === "desc" ? -1 : 1;

        const items = await InventoryItem.find(query)
            .populate("supplier", "name contactPerson phone")
            .sort({ [safeSortBy]: safeOrder });

        // Add AI suggestions for each item
        const itemsWithSuggestions = await Promise.all(
            items.map(async (item) => {
                const forecast = await Forecast.findOne({ item: item._id })
                    .sort({ createdAt: -1 });

                let suggestion = "Normal";
                if (item.currentStock <= item.reorderLevel) suggestion = "Urgent Reorder";
                else if (item.currentStock <= item.minStock) suggestion = "Reorder Recommended";
                else if (forecast && forecast.predictedDemand > item.currentStock) suggestion = "Increase Stock";

                return {
                    ...item.toObject(),
                    aiSuggestion: suggestion,
                    forecast: forecast || null
                };
            })
        );

        res.status(200).json({
            success: true,
            data: itemsWithSuggestions
        });
    } catch (error) {
        next(error);
    }
};

const getInventoryOverview = async (req, res, next) => {
    try {
        const activeItems = await InventoryItem.find({ isActive: true }).lean();

        const totals = activeItems.reduce(
            (acc, item) => {
                acc.totalItems += 1;
                acc.totalStockValue += (item.currentStock || 0) * (item.costPrice || 0);
                if (item.currentStock <= 0) acc.outOfStock += 1;
                if (item.currentStock > 0 && item.currentStock <= item.reorderLevel) acc.lowStock += 1;
                return acc;
            },
            { totalItems: 0, totalStockValue: 0, lowStock: 0, outOfStock: 0 }
        );

        const wasteAgg = await WasteRecord.aggregate([
            {
                $group: {
                    _id: null,
                    totalWasteCost: { $sum: "$cost" },
                    totalWasteQuantity: { $sum: "$quantity" }
                }
            }
        ]);

        const pendingPurchaseOrders = await PurchaseOrder.countDocuments({
            status: { $in: ["Pending", "Approved"] }
        });

        const categoryBreakdown = await InventoryItem.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: "$category",
                    itemCount: { $sum: 1 },
                    stockValue: { $sum: { $multiply: ["$currentStock", "$costPrice"] } }
                }
            },
            { $sort: { stockValue: -1 } }
        ]);

        const wasteSummary = wasteAgg[0] || { totalWasteCost: 0, totalWasteQuantity: 0 };

        res.status(200).json({
            success: true,
            data: {
                ...totals,
                totalStockValue: Math.round(totals.totalStockValue),
                totalWasteCost: Math.round(wasteSummary.totalWasteCost),
                totalWasteQuantity: wasteSummary.totalWasteQuantity,
                pendingPurchaseOrders,
                categoryBreakdown
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update inventory stock
const updateInventoryStock = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { quantity, type, reason, cost } = req.body; // type: 'add' or 'remove'

        const item = await InventoryItem.findById(itemId);
        if (!item) {
            const error = createHttpError(404, "Inventory item not found");
            return next(error);
        }

        if (type === 'remove') {
            if (item.currentStock < quantity) {
                const error = createHttpError(400, "Insufficient stock");
                return next(error);
            }

            item.currentStock -= quantity;
            
            // Record waste if applicable
            if (reason && ['Expired', 'Spoilage', 'Preparation Waste'].includes(reason)) {
                const wasteRecord = new WasteRecord({
                    item: itemId,
                    quantity,
                    reason,
                    cost: cost || (quantity * item.costPrice),
                    recordedBy: req.user._id
                });
                await wasteRecord.save();
            }
        } else {
            item.currentStock += quantity;
            item.lastUpdated = new Date();
        }

        await item.save();

        res.status(200).json({
            success: true,
            message: "Inventory updated successfully",
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// Add supplier
const addSupplier = async (req, res, next) => {
    try {
        const { name, contactPerson, phone, email, location, paymentTerms } = req.body;

        const supplier = new Supplier({
            name,
            contactPerson,
            phone,
            email,
            location,
            paymentTerms
        });

        await supplier.save();

        res.status(201).json({
            success: true,
            message: "Supplier added successfully",
            data: supplier
        });
    } catch (error) {
        next(error);
    }
};

// Get suppliers
const getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Supplier.find({ isActive: true }).sort({ name: 1 });
        res.status(200).json({
            success: true,
            data: suppliers
        });
    } catch (error) {
        next(error);
    }
};

// Create purchase order
const createPurchaseOrder = async (req, res, next) => {
    try {
        const { supplier, items } = req.body;

        let totalAmount = 0;
        const orderItems = [];

        for (const itemData of items) {
            const item = await InventoryItem.findById(itemData.item);
            if (!item) {
                const error = createHttpError(404, `Item ${itemData.item} not found`);
                return next(error);
            }

            const itemTotal = itemData.quantity * itemData.unitPrice;
            totalAmount += itemTotal;

            orderItems.push({
                item: itemData.item,
                quantity: itemData.quantity,
                unitPrice: itemData.unitPrice,
                totalPrice: itemTotal
            });
        }

        const purchaseOrder = new PurchaseOrder({
            supplier,
            items: orderItems,
            totalAmount,
            expectedDeliveryDate: req.body.expectedDeliveryDate
        });

        await purchaseOrder.save();

        res.status(201).json({
            success: true,
            message: "Purchase order created successfully",
            data: purchaseOrder
        });
    } catch (error) {
        next(error);
    }
};

// Get reorder suggestions
const getReorderSuggestions = async (req, res, next) => {
    try {
        const items = await InventoryItem.find({ isActive: true });
        const suggestions = [];

        for (const item of items) {
            const forecast = await calculateDemandForecast(item._id, 30);
            const currentStock = item.currentStock;
            const predictedWeeklyDemand = forecast.predictedDemand;

            let suggestion = null;
            let reorderQuantity = 0;

            if (currentStock <= item.reorderLevel) {
                // Urgent reorder
                reorderQuantity = Math.max(item.maxStock - currentStock, predictedWeeklyDemand);
                suggestion = {
                    type: "Urgent Reorder",
                    quantity: reorderQuantity,
                    reason: "Stock below reorder level"
                };
            } else if (currentStock <= predictedWeeklyDemand) {
                // Recommended reorder
                reorderQuantity = Math.max(item.minStock - currentStock, predictedWeeklyDemand);
                suggestion = {
                    type: "Recommended Reorder",
                    quantity: reorderQuantity,
                    reason: "Stock may run out based on predicted demand"
                };
            }

            if (suggestion) {
                suggestions.push({
                    item: item,
                    suggestion,
                    forecast: {
                        predictedDemand: predictedWeeklyDemand,
                        confidenceLevel: forecast.confidenceLevel
                    }
                });
            }
        }

        res.status(200).json({
            success: true,
            data: suggestions
        });
    } catch (error) {
        next(error);
    }
};

// Get waste analysis
const getWasteAnalysis = async (req, res, next) => {
    try {
        const { startDate, endDate, item } = req.query;
        
        let query = {};
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (item) query.item = item;

        const wasteRecords = await WasteRecord.find(query)
            .populate("item", "name category")
            .populate("recordedBy", "name");

        const totalWasteCost = wasteRecords.reduce((sum, record) => sum + record.cost, 0);
        const totalWasteQuantity = wasteRecords.reduce((sum, record) => sum + record.quantity, 0);

        // Group by reason
        const wasteByReason = wasteRecords.reduce((acc, record) => {
            acc[record.reason] = (acc[record.reason] || 0) + record.cost;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                totalWasteCost,
                totalWasteQuantity,
                wasteByReason,
                records: wasteRecords
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addInventoryItem,
    getInventoryItems,
    getInventoryOverview,
    updateInventoryStock,
    addSupplier,
    getSuppliers,
    createPurchaseOrder,
    getReorderSuggestions,
    getWasteAnalysis,
    calculateDemandForecast
};
