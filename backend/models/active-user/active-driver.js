const mongoose = require("mongoose");

const ActiveDriver = new mongoose.Schema({
  UID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "",
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
});

module.export(ActiveDriver);
