const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
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
    minlength: 8,
    maxlength: 32,
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
  },
  image: {
    type: Buffer,
    required: false,
  },
  rating: {
    type: mongoose.Types.Decimal128,
    required: false,
  },
  active: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// Database middleware
// UserSchema.pre("save", async (next) => {
//   const user = this;
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, bcrypt.genSalt());
//   }
//   next();
// });

module.exports = mongoose.model("User", UserSchema);
