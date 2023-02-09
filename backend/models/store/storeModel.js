const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  longitude: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  latitude: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  logo: {
    type: Buffer,
    required: false,
  },
  rating: {
    type: mongoose.Types.Decimal128,
    required: false,
  },
  timing: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Store", StoreSchema);
