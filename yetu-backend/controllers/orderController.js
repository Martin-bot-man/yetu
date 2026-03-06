const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const { default: mongoose } = require("mongoose");

const addOrder = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Order created!", data: order });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("table");
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    // Deduct inventory if order is completed
    if (orderStatus === 'Completed') {
      await deductInventoryFromOrder(order);
    }

    res
      .status(200)
      .json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    next(error);
  }
};

// Helper function to deduct inventory
const deductInventoryFromOrder = async (order) => {
  const { InventoryItem, WasteRecord } = require("../models/inventoryModel");
  
  for (const item of order.items) {
    try {
      const inventoryItem = await InventoryItem.findOne({ name: item.name });
      if (inventoryItem) {
        // Calculate waste based on item type
        const wastePercentage = inventoryItem.isPerishable ? 0.15 : 0.05; // Kenyan averages
        const wasteQuantity = Math.ceil(item.quantity * wastePercentage);
        const actualConsumed = item.quantity + wasteQuantity;

        // Update inventory
        inventoryItem.currentStock -= actualConsumed;
        inventoryItem.lastUpdated = new Date();
        await inventoryItem.save();

        // Record waste if applicable
        if (wasteQuantity > 0) {
          const wasteRecord = new WasteRecord({
            item: inventoryItem._id,
            quantity: wasteQuantity,
            reason: 'Preparation Waste',
            cost: wasteQuantity * inventoryItem.costPrice,
            recordedBy: order.createdBy || null
          });
          await wasteRecord.save();
        }
      }
    } catch (error) {
      console.error(`Error updating inventory for item ${item.name}:`, error);
    }
  }
};

module.exports = { addOrder, getOrderById, getOrders, updateOrder };