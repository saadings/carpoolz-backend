const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { resolve } = require("path");
require("dotenv").config({
  path: resolve(__dirname, "../config/.env"),
});

const UserSessionSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

UserSessionSchema.method.verifyToken = function (refreshToken) {
  if (refreshToken !== this.refreshToken) return false;
  return jwt.verify(refreshToken, process.env.RT_SECRET_KEY);
};

module.exports = mongoose.model("UserSession", UserSessionSchema);
