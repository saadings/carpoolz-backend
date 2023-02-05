const mongoose = require("mongoose");

const UserSessionSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  jwt: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("UserSession", UserSessionSchema);
