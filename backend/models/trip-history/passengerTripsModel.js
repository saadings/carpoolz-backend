const mongoose = require("mongoose");

const PassengerTripsSchema = new mongoose.Schema({
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
  tripID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DriverTrips",
  },
  userID: {
    //foreign
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.export("PassengerTrips", PassengerTripsSchema);
