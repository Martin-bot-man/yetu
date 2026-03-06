const express = require("express");
const { 
    addInventoryItem, 
    getInventoryItems, 
    getInventoryOverview,
    updateInventoryStock, 
    addSupplier, 
    getSuppliers,
    createPurchaseOrder,
    getReorderSuggestions,
    getWasteAnalysis
} = require("../controllers/inventoryController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();

// Inventory Items Routes
router.route("/items")
    .post(isVerifiedUser, addInventoryItem)
    .get(isVerifiedUser, getInventoryItems);

router.route("/items/:itemId/stock")
    .put(isVerifiedUser, updateInventoryStock);

// Suppliers Routes
router.route("/suppliers")
    .post(isVerifiedUser, addSupplier)
    .get(isVerifiedUser, getSuppliers);

// Purchase Orders Routes
router.route("/purchase-orders")
    .post(isVerifiedUser, createPurchaseOrder);

// AI-Powered Analytics Routes
router.route("/analytics/reorder-suggestions")
    .get(isVerifiedUser, getReorderSuggestions);

router.route("/analytics/overview")
    .get(isVerifiedUser, getInventoryOverview);

router.route("/analytics/waste-analysis")
    .get(isVerifiedUser, getWasteAnalysis);

module.exports = router;
