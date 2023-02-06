const User = require("../../models/users/userModel");
const bcrypt = require("bcryptjs");
var sendOtp = require("../../utils/services/sendOTP");

exports.registerUser = async (req, res) => {
  const {
    userName,
    email,
    password,
    firstName,
    lastName,
    contactNumber,
    gender,
  } = req.body;

  try {
    if (
      !userName ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !contactNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields.",
      });
    }

    const alreadyExists = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    });

    if (alreadyExists)
      return res.status(400).json({
        success: false,
        code: 2,
        message: "User already exists.",
      });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create a new user
    const user = new User({
      userName: userName,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      gender: gender,
      image: req.body?.image,
      rating: 0.0,
      active: false,
    });

    if (await !sendOtp(user.email, otp, user.userName)) {
      return res.status(400).json({
        success: false,
        code: 3,
        message: "Unable to send OTP.",
      });
    }

    // Save the user to the database
    user.save((error) => {
      if (error) {
        const validationErrors = [];
        for (field in error.errors) {
          validationErrors.push(error.errors[field].message);
        }
        return res.status(400).json({
          success: false,
          code: 1,
          message: "Validation failed",
          errors: validationErrors,
        });
      }
      return res.status(201).json({
        success: true,
        code: 0,
        message: "User created successfully.",
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: -1,
      message: "Internal server error.",
    });
  }
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");
  else {
    res.json("Login Successfully");
  }
};
