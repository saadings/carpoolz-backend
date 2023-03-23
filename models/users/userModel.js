const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("../../utils/getEnv");

const UserSchema = new mongoose.Schema({
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
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s])(?!.*[\n\r]).{8,}$/.test(
          value
        );
      },
      message:
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
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
  rating: {
    type: Number,
    required: true,
    min: 0.0,
    max: 5.0,
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
});

//Database middleware
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});

// Middleware for deleting OTP if the user verifies
UserSchema.pre("deleteMany", async function (next) {
  // Get the query conditions
  const conditions = this.getQuery();

  // Remove all the child documents that have a reference to the parent ids
  mongoose
    .model("UserOTP")
    .deleteMany({ parent: { $in: conditions._id } }, next);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
