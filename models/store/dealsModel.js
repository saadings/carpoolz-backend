const mongoose = require("mongoose");

const DealsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  storeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
});

module.exports = mongoose.model("Deals", DealsSchema);
