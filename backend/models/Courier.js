const mongoose = require("mongoose");

const courierSchema = new mongoose.Schema({
  clientName: String,
  receiverName: String,
    address: String,  
  center: String,
  weight: Number,
  charge: Number,
  type: String,
  courierType: String,
  docketNumber: String,
  mode: String,
  phone: String,
  date: {
    type: Date,
    default: Date.now
  },
  address: {
  type: String,
  default: ""
}
});

module.exports = mongoose.model("Courier", courierSchema);
