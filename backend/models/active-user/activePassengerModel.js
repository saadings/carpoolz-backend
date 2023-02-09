const mongoose = require("mongoose");

const ActivePassengerSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
});

module.exports = mongoose.model("ActivePassengers", ActivePassengerSchema);
