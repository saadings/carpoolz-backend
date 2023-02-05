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
    //foreign
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  vehicleID: {
    //foreign
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.export("DriverTrips", DriverTripsSchema);
