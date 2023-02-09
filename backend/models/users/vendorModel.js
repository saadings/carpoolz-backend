const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Vendor", VendorSchema);
