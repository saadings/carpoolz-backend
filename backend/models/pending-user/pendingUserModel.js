const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const PendingUserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z]+$/.test(value);
      },
      message: "{VALUE} is not a valid name",
    },
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z]+$/.test(value);
      },
      message: "{VALUE} is not a valid name",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          value
        );
      },
      message: "{VALUE} is not a valid email address!",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value);
      },
      message:
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number.",
    },
  },
  contactNumber: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 14,
    validate: {
      validator: function (value) {
        return /^\d+$/.test(value);
      },
      message: "{VALUE} is not a valid contact number!",
    },
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  image: {
    type: Buffer,
    required: false,
    validate: {
      validator: function (value) {
        const allowedTypes = ["image/jpeg", "image/png"];
        return allowedTypes.includes(value.contentType);
      },
      message: "Invalid image type. Only JPEG and PNG formats are allowed.",
    },
  },
  otp: {
    type: String,
    required: true,
    minlength: 6,
    validate: {
      validator: function (value) {
        return /^\d{6}$/.test(value);
      },
      message: "OTP must be of length 6 and should only contain digits.",
    },
  },
  expirationDate: { type: Date, default: Date.now, expires: "2m" },
  // expireAt: {
  //   type: Date,
  //   default: Date.now,
  //   expires: "120s", // 1 day in seconds
  // },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  //   required: true,
  //   // expires: 15, // 1 day in seconds
  //   // expires: "30s", // 1 day in seconds
  // },
});

//Database middleware
PendingUserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  // if (user.isModified("otp")) {
  //   const salt = await bcrypt.genSalt(10);
  //   user.otp = await bcrypt.hash(user.otp, salt);
  // }
  next();
});

PendingUserSchema.methods.compareOTP = async function (enteredOTP) {
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

// Setting up TTL
// PendingUserSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model("PendingUser", PendingUserSchema);
