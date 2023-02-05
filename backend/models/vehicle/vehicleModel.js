const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  driverID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  vehicleColor: {
    type: String,
    required: true,
  },
  numOfSeats: {
    type: Number,
    required: true,
  },
});

module.export(VehicleSchema);
