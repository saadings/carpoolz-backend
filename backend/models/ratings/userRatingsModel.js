const mongoose = require("mongoose");

const UserRatingsSchema = new mongoose.Schema({
  giverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: mongoose.Types.Decimal128,
  },
});

module.exports = mongoose.model("UserRatings", UserRatingsSchema);
