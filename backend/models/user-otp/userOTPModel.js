const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserOTPSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  otp: {
    type: String,
    maxLength: 6,
    minLength: 6,
    required: true,

    validate: {
      validator: function (value) {
        return /^\d+$/.test(value);
      },
      message: "{VALUE} is not a valid OTP!",
    },
  },
  expiryTime: {
    type: Date,
    required: true,
  },
});

UserOTPSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("otp")) {
    const salt = await bcrypt.genSalt(10);
    user.otp = await bcrypt.hash(user.otp, salt);
  }
  next();
});

UserOTPSchema.methods.compareOTP = async function (enteredOTP) {
  const timeDiff = Date.now() - this.expiresAt;

  if (timeDiff > 0)
    return {
      code: -1,
      message: "OTP expired.",
    };

  return (await bcrypt.compare(enteredOTP, this.otp))
    ? { code: 0, message: "OTP verified." }
    : { code: -2, message: "OTP Invalid." };
};

module.exports = mongoose.model("UserOTP", UserOTPSchema);
