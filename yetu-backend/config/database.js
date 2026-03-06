const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  await mongoose.connect(config.db);
  console.log("✅ MongoDB connected successfully");
};

module.exports = connectDB;
