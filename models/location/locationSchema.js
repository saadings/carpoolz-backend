const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  longitude: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  latitude: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
});

exports.LocationSchema = LocationSchema;
