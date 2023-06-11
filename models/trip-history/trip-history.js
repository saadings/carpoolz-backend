const { LocationSchema } = require("../location/locationSchema");
const mongoose = require("mongoose");

const driverTripSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  route: {
    type: {},
    required: true,
  },
});

const passengerTripSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  route: {
    type: {},
    required: true,
  },
});

const TripHistory = new mongoose.Schema({
  driver: {
    type: driverTripSchema,
    required: true,
  },
  passengers: [
    {
      type: passengerTripSchema,
      required: true,
    },
  ],
  active: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("TripHistory", TripHistory);
