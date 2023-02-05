const mongoose = require("mongoose");

const DriverTripsSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  numOfPassengers: {
    type: Number,
    required: true,
  },
  driverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  vehicleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
  },
});

module.exports = mongoose.model("DriverTrips", DriverTripsSchema);
