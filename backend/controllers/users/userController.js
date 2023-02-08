const User = require("../../models/users/userModel");
//const PendingUser = require("../../models/pending-user/pendingUserModel");
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
        code: -1,
        message: "Please provide all the required fields.",
      });
    }

    const alreadyExists = await PendingUser.findOne({
      $or: [{ userName: userName }, { email: email }],
    });

    if (alreadyExists)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User already exists.",
      });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires after 10 minutes

    const pendingUser = new PendingUser({
      userName: userName,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      gender: gender,
      image: req.body?.image,
      otp: otp,
      //expireAt: new Date(Date.now()),
    });

    // Save the pending user to the database
    pendingUser.save((error) => {
      if (error) {
        const validationErrors = [];
        for (field in error.errors) {
          validationErrors.push(error.errors[field].message);
        }
        return res.status(400).json({
          success: false,
          code: -1,
          message: "Validation failed",
          errors: validationErrors,
        });
      }

      if (!sendOtp(pendingUser.email, otp, pendingUser.userName)) {
        return res.status(400).json({
          success: false,
          code: -3,
          message: "Unable to send OTP.",
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

exports.verifyOTP = async (req, res) => {
  try {
    const { userName, email, otp } = req.body;

    if (!userName || !email || !otp)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });

    const pendingUser = await PendingUser.findOne({
      $and: [{ userName: userName }, { email: email }],
    });

    if (!pendingUser)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User doesn't exists.",
      });

    const compareOTP = await pendingUser.compareOTP(otp);

    if (compareOTP?.code < 0)
      return res.status(400).json({
        success: false,
        code: -2,
        message: compareOTP?.message,
      });

    const user = new User({
      userName: pendingUser.userName,
      email: pendingUser.email,
      password: pendingUser.password,
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      contactNumber: pendingUser.contactNumber,
      gender: pendingUser.gender,
      image: pendingUser.image,
      rating: 0.0,
      active: true,
    });

    // Save the user to the database
    user.save((error) => {
      if (error) {
        const validationErrors = [];
        for (field in error.errors) {
          validationErrors.push(error.errors[field].message);
        }
        return res.status(400).json({
          success: false,
          code: -1,
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
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "Invalid email or password.",
      });
    else if (!user.active)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "User is not activated",
      });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Invalid email or password.",
      });
    else {
      return res.status(201).json({
        success: true,
        code: 0,
        message: "User Login Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: -1,
      message: "Internal server error.",
    });
  }
};
