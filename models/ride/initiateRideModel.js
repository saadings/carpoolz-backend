const mongoose = require("mongoose");

const InitiateRideSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  longitude: {
    type: mongoose.Types.Decimal128,
  },
  latitude: {
    type: mongoose.Types.Decimal128,
  },
  timeElapsed: {
    type: Data,
  },
  rating: {
    type: mongoose.Types.Decimal128,
  },
});

module.exports = mongoose.model("InitiateRide", InitiateRideSchema);
