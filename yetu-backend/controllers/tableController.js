const Table = require("../models/tableModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");

const addTable = async (req, res, next) => {
  try {
    const { tableNo, seats } = req.body;
    if (!tableNo) {
      const error = createHttpError(400, "Please provide table No!");
      return next(error);
    }
    const isTablePresent = await Table.findOne({ tableNo });

    if (isTablePresent) {
      const error = createHttpError(400, "Table already exist!");
      return next(error);
    }

    const newTable = new Table({ tableNo, seats });
    await newTable.save();
    res
      .status(201)
      .json({ success: true, message: "Table added!", data: newTable });
  } catch (error) {
    next(error);
  }
};

const getTables = async (req, res, next) => {
  try {
    const { status, search, minSeats, maxSeats, sortBy = "tableNo", order = "asc" } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const tableNoSearch = Number(search);
      if (!Number.isNaN(tableNoSearch)) {
        query.tableNo = tableNoSearch;
      }
    }

    if (minSeats || maxSeats) {
      query.seats = {};
      if (minSeats) query.seats.$gte = Number(minSeats);
      if (maxSeats) query.seats.$lte = Number(maxSeats);
    }

    const validSortFields = ["tableNo", "status", "seats"];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : "tableNo";
    const safeOrder = order === "desc" ? -1 : 1;

    const tables = await Table.find(query)
      .sort({ [safeSortBy]: safeOrder })
      .populate({
      path: "currentOrder",
      select: "customerDetails orderStatus",
    });

    const summary = tables.reduce(
      (acc, table) => {
        if (table.status === "Booked") acc.booked += 1;
        else acc.available += 1;
        acc.seats += table.seats;
        return acc;
      },
      { total: tables.length, booked: 0, available: 0, seats: 0 }
    );

    res.status(200).json({ success: true, data: { tables, summary } });
  } catch (error) {
    next(error);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const { status, orderId } = req.body;

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    if (status && !["Booked", "Available"].includes(status)) {
      const error = createHttpError(400, "Invalid table status");
      return next(error);
    }

    if (
      orderId &&
      orderId !== "null" &&
      !mongoose.Types.ObjectId.isValid(orderId)
    ) {
      const error = createHttpError(400, "Invalid order id!");
      return next(error);
    }

    const updatePayload = {};
    if (status) updatePayload.status = status;
    updatePayload.currentOrder = orderId && orderId !== "null" ? orderId : null;

    const table = await Table.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true }
    );

    if (!table) {
      const error = createHttpError(404, "Table not found!");
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Table updated!", data: table });
  } catch (error) {
    next(error);
  }
};

module.exports = { addTable, getTables, updateTable };
