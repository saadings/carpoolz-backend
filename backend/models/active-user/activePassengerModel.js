const mongoose = require("mongoose");
const { LocationSchema } = require("../location/locationSchema");

const ActivePassengerSchema = new mongoose.Schema({
  userName: {
    type: String,
    ref: "User",
    required: true,
  },
  origin: {
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
});

module.exports = mongoose.model("ActivePassengers", ActivePassengerSchema);
