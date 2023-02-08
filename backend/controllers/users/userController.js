const User = require("../../models/users/userModel");
const UserOTP = require("../../models/user-otp/userOTPModel");
const bcrypt = require("bcryptjs");
const sendOtp = require("../../utils/services/sendOTP");

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

    const alreadyExists = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    });

    if (alreadyExists)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User already exists.",
      });

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

    try {
      await user.save();
    } catch (error) {
      if (error) {
        const validationErrors = [];
        for (field in error.errors) {
          validationErrors.push(error.errors[field].message);
        }
        return res.status(400).json({
          success: false,
          code: -1,
          message: "Validation failed in saving user.",
          errors: validationErrors,
        });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // expires after 10 minutes

    const userOtp = new UserOTP({
      userID: user._id,
      otp: otp,
      expiryTime: expiryTime,
    });

    try {
      await userOtp.save();
    } catch (error) {
      if (error) {
        const validationErrors = [];
        for (field in error.errors) {
          validationErrors.push(error.errors[field].message);
        }
        return res.status(400).json({
          success: false,
          code: -1,
          message: "Validation failed in saving otp.",
          errors: validationErrors,
        });
      }
    }

    if (!sendOtp(user.email, otp, user.userName)) {
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

    const users = await User.findOne({
      $and: [{ userName: userName }, { email: email }],
    });

    if (!users)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User doesn't exists.",
      });

    if (users.active)
      return res.status(400).json({
        success: false,
        code: -4,
        message: "User already active.",
      });

    const userOtp = await UserOTP.findOne({ userID: users._id });
    if (!userOtp)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User doesn't exists.",
      });

    const compareOTP = await userOtp.compareOTP(otp);

    if (compareOTP?.code < 0)
      return res.status(400).json({
        success: false,
        code: -3,
        message: compareOTP?.message,
      });

    try {
      await User.updateOne(
        {
          $and: [{ userName: userName }, { email: email }],
        },
        { $set: { active: true } }
      );
    } catch (error) {
      if (error) {
        const validationErrors = [];
        for (field in error.errors) {
          validationErrors.push(error.errors[field].message);
        }
        return res.status(400).json({
          success: false,
          code: -1,
          message: "Validation failed in saving user.",
          errors: validationErrors,
        });
      }
    }

    try {
      await UserOTP.deleteOne({ userID: users._id });
    } catch (error) {
      if (error) {
        const validationErrors = [];
        for (field in error.errors) {
          validationErrors.push(error.errors[field].message);
        }
        return res.status(400).json({
          success: false,
          code: -1,
          message: "Validation failed in saving user.",
          errors: validationErrors,
        });
      }
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "User verified successfully.",
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
