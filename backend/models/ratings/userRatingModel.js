const mongoose = require("mongoose");

const UserRatingSchema = new mongoose.Schema({
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

module.export(UserRatingSchema);
