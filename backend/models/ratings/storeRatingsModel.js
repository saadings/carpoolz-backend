const mongoose = require("mongoose");

const StoreRatingSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "",
  },
  storeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "",
  },
  rating: {
    type: mongoose.Types.Decimal128,
  },
});

module.exports = mongoose.model("StoreRating", StoreRatingSchema);
