const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer,
    required: false,
  },
  rating: {
    type: mongoose.Decimal128,
    required: false,
  },
  active: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// Database middleware
UserSchema.pre("save", async (next) => {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, bcrypt.genSalt());
  }
  next();
});

module.export(UserSchema);
