const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "",
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
});

module.export(VendorSchema);
