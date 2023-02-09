var mongoose = require("mongoose");

const DriverModel = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  cnic: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 14,
    validate: {
      validator: function (value) {
        return /^\d+$/.test(value);
      },
      message: "{VALUE} is not a valid CNIC. Write CNIC without '-'!",
    },
  },
  licenseNo: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /[^-]+/.test(value);
      },
      message: "{VALUE} is not a valid license No. Write license No without '-'!",
    },
  },
  rating: {
    type: mongoose.Types.Decimal128,
    required: true,
    min: 0.0,
    max: 5.0,
  },
});

module.exports = mongoose.model("Driver", DriverModel);
