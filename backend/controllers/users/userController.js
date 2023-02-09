var bcrypt = require("bcryptjs");
var User = require("../../models/users/userModel");
var UserOTP = require("../../models/user-otp/userOTPModel");
var sendOtp = require("../../utils/services/sendOTP");

exports.registerUser = async (req, res) => {
  var {
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

    var alreadyExists = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    });

    if (alreadyExists)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User already exists.",
      });

    var user = new User({
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
        var validationErrors = [];
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

    var otp = Math.floor(100000 + Math.random() * 900000);
    var expiryTime = new Date(Date.now() + 10 * 60 * 1000); // expires after 10 minutes

    var userOtp = new UserOTP({
      userID: user._id,
      otp: otp,
      expiryTime: expiryTime,
    });

    try {
      await userOtp.save();
    } catch (error) {
      if (error) {
        var validationErrors = [];
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
    var { userName, email, otp } = req.body;

    if (!userName || !email || !otp)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });

    var users = await User.findOne({
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

    var userOtp = await UserOTP.findOne({ userID: users._id });
    if (!userOtp)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User doesn't exists.",
      });

    var compareOTP = await userOtp.compareOTP(otp);

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
        var validationErrors = [];
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
        var validationErrors = [];
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

exports.resendOTP = async (req, res) => {
  try {
    var { userName, email } = req.body;

    if (!userName || !email)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });

    var user = await User.findOne({
      $and: [{ userName: userName }, { email: email }],
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User doesn't exists.",
      });

    if (user.active)
      return res.status(400).json({
        success: false,
        code: -4,
        message: "User already active.",
      });

    var userOtp = await UserOTP.findOne({ userID: user._id });
    if (!userOtp)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User doesn't exists.",
      });

    var otp = Math.floor(100000 + Math.random() * 900000);
    var expiryTime = new Date(Date.now() + 10 * 60 * 1000); // expires after 10 minutes

    try {
      userOtp.otp = otp;
      userOtp.expiryTime = expiryTime;
      await userOtp.save();
    } catch (error) {
      if (error) {
        var validationErrors = [];
        for (field in error.errors) {
          validationErrors.push(error.errors[field].message);
        }
        return res.status(400).json({
          success: false,
          code: -1,
          message: "Validation failed in updating re-send otp.",
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
      message: "OTP re-sent successfully.",
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
    var user = await User.findOne({ email: req.body.email });
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

    var validPassword = await bcrypt.compare(req.body.password, user.password);
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
