const mongoose = require("mongoose");

const UserRatingsSchema = new mongoose.Schema({
  giverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "",
  },
  receiverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "",
  },
  rating: {
    type: mongoose.Types.Decimal128,
  },
});

module.exports = mongoose.model("UserRatings", UserRatingsSchema);
