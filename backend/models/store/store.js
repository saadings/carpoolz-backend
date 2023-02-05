const mongoose = require("mongoose");

const Store = new mongoose.Schema({
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
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "",
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
    type: mongoose.Decimal128,
    required: false,
  },
  timing: {
    type: String,
    required: true,
  },
});

module.export(Store);
