const mongoose = require("mongoose");

const courierSchema = new mongoose.Schema({
  clientName: String,
  receiverName: String,

  // Address (keep only once)
  address: {
    type: String,
    default: ""
  },

  center: String,
  weight: Number,
  charge: Number,
  type: String,
  courierType: String,
  docketNumber: String,
  mode: String,
  phone: String,

  // 📅 Shipment date (manual or auto)
  date: {
    type: Date,
    default: Date.now
  },

  // ⏱ Entry timestamp (NEW — auto)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Courier", courierSchema);