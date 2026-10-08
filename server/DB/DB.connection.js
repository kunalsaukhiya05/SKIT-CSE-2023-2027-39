const mongoose = require("mongoose");

const DBConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`DataBase Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Error In DataBase Connection:", err.message);
  }
};

module.exports = DBConnection;