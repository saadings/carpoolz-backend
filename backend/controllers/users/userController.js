var UserSession = require("../../models/user-session/userSessionModel");
var User = require("../../models/users/userModel");
var UserOTP = require("../../models/user-otp/userOTPModel");
var sendOtp = require("../../utils/services/sendOTP");
const validationError = require("../../utils/errorHandling/validationError");
const serverError = require("../../utils/errorHandling/serverError");
const {
  generateJWTToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../utils/services/jwt");

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
      !contactNumber ||
      !gender
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
      return res.status(400).json(validationError(error));
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
      return res.status(400).json(validationError(error));
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
    return res.status(500).json(serverError());
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
      return res.status(400).json(validationError(error));
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
    return res.status(500).json(serverError());
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
      return res.status(400).json(validationError(error));
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
    return res.status(500).json(serverError());
  }
};

exports.loginUser = async (req, res) => {
  var { userName, email, password } = req.body;

  try {
    if ((!userName && !email) || !password) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });
    }

    var user = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "Invalid username, email or password.",
      });

    if (!user.active)
      return res.status(400).json({
        success: false,
        code: -3,
        message: "User is not active",
      });

    var validPassword = await user.comparePassword(password);
    if (!validPassword)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "Invalid username, email or password.",
      });

    var userLog = await UserSession.findOne({ userID: user._id });

    var accessToken = generateJWTToken({
      id: user._id,
      userName: user.userName,
      email: user.email,
    });

    var refreshToken = generateRefreshToken({
      id: user._id,
      userName: user.userName,
      email: user.email,
    });

    if (!userLog)
      userLog = new UserSession({
        userID: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    else
      (userLog.accessToken = accessToken),
        (userLog.refreshToken = refreshToken);

    try {
      await userLog.save();
    } catch (error) {
      return res.status(400).json(validationError(error));
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "User logged in Successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};

exports.logoutUser = async (req, res) => {
  var { userName, email } = req.body;

  try {
    if (!userName && !email) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });
    }

    var user = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "Invalid username or email.",
      });

    if (!user.active)
      return res.status(400).json({
        success: false,
        code: -3,
        message: "User is not active",
      });

    var userLog = await UserSession.findOne({ userID: user._id });

    if (!userLog)
      return res.status(400).json({
        success: false,
        code: -4,
        message: "User not logged in.",
      });

    try {
      await UserSession.deleteOne({ userID: userLog.userID });
    } catch (error) {
      return res.status(400).json(validationError(error));
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "User logged out Successfully",
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};

exports.refreshToken = async (req, res) => {
  var { refreshToken } = req.body;

  try {
    // if (!refreshToken)
    //   return res.status(400).json({
    //     success: false,
    //     code: -1,
    //     message: "Please provide all the required fields.",
    //   });

    // var userToken = await UserSession.findOne({ refreshToken: refreshToken });

    // if (!userToken)
    //   return res.status(400).json({
    //     success: false,
    //     code: -2,
    //     message: "User not logged in.",
    //   });

    var decodeRefreshToken = verifyRefreshToken(refreshToken);

    // if (decodeRefreshToken.id !== userToken.userID.toString())
    //   return res.status(400).json({
    //     success: false,
    //     code: -2,
    //     message: "Invalid refresh token.",
    //   });

    var accessToken = generateJWTToken({
      id: decodeRefreshToken.id,
      userName: decodeRefreshToken.userName,
      email: decodeRefreshToken.email,
    });

    var userLog = await UserSession.findOne({ refreshToken: refreshToken });

    userLog.accessToken = accessToken;

    try {
      await userLog.save();
    } catch (error) {
      return res.status(400).json(validationError(error));
    }

    return res.status(200).json({
      success: true,
      code: 0,
      message: "JWT refreshed successfully",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};
