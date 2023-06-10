const { LocationSchema } = require("../location/locationSchema");
const mongoose = require("mongoose");

const InitiateRideSchema = new mongoose.Schema({
  source: {
    type: LocationSchema,
    required: true,
  },
  destination: {
    type: LocationSchema,
    required: true,
  },
  route: {
    type: {},
    required: true,
  },
  // timeElapsed: {
  //   type: Date,
  // },
  rating: {
    type: mongoose.Types.Decimal128,
  },
});

module.exports = mongoose.model("InitiateRide", InitiateRideSchema);
