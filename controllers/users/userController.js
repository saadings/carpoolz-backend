const Driver = require("../../models/users/driverModel");
const UserSession = require("../../models/user-session/userSessionModel");
const User = require("../../models/users/userModel");
const UserOTP = require("../../models/user-otp/userOTPModel");
const sendOtp = require("../../utils/services/sendOTP");
const validationError = require("../../utils/error-handling/validationError");
const serverError = require("../../utils/error-handling/serverError");
const {
  generateJWTToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../utils/services/jwt");

exports.registerUser = async (req, res) => {
  let {
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

    let alreadyExists = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    });

    if (alreadyExists)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User already exists.",
      });

    let user = new User({
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

    let otp = Math.floor(100000 + Math.random() * 900000);
    let expiryTime = new Date(Date.now() + 10 * 60 * 1000); // expires after 10 minutes

    let userOtp = new UserOTP({
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
  let { userName, otp } = req.body;
  try {
    if (!userName || !otp)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });

    let users = await User.findOne({
      userName: userName,
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

    let userOtp = await UserOTP.findOne({ userID: users._id });
    if (!userOtp)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User doesn't exists.",
      });

    let compareOTP = await userOtp.compareOTP(otp);

    if (compareOTP?.code < 0)
      return res.status(400).json({
        success: false,
        code: -3,
        message: compareOTP?.message,
      });

    try {
      await User.updateOne({ userName: userName }, { $set: { active: true } });
    } catch (error) {
      return res.status(400).json(validationError(error));
    }

    try {
      await UserOTP.deleteOne({ userID: users._id });
    } catch (error) {
      if (error) {
        let validationErrors = [];
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
    let { userName } = req.body;

    if (!userName)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide the username",
      });

    let user = await User.findOne({
      userName: userName,
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

    let userOtp = await UserOTP.findOne({ userID: user._id });
    if (!userOtp)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User doesn't exists.",
      });

    let otp = Math.floor(100000 + Math.random() * 900000);
    let expiryTime = new Date(Date.now() + 10 * 60 * 1000); // expires after 10 minutes

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
  let { userName, password } = req.body;

  try {
    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });
    }

    let user = await User.findOne({
      userName: userName,
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "Invalid username or password.",
      });

    if (!user.active)
      return res.status(400).json({
        success: false,
        code: -3,
        message: "User is not active",
      });

    let validPassword = await user.comparePassword(password);
    if (!validPassword)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "Invalid username or password.",
      });

    let userLog = await UserSession.findOne({ userID: user._id });

    let accessToken = generateJWTToken({
      id: user._id,
      userName: user.userName,
      email: user.email,
    });

    let refreshToken = generateRefreshToken({
      id: user._id,
      userName: user.userName,
      email: user.email,
    });
    let types = [];

    let driver = await Driver.findOne({
      userID: user._id,
    });

    if (driver) {
      types.push("Driver");
    }

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
      data: {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        gender: user.gender,
        rating: user.rating,
        active: user.active,
        types: types,
      },
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};

exports.logoutUser = async (req, res) => {
  let { userName } = req.body;

  try {
    if (!userName) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });
    }

    let user = await User.findOne({
      userName: userName,
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "Invalid username",
      });

    if (!user.active)
      return res.status(400).json({
        success: false,
        code: -3,
        message: "User is not active",
      });

    let userLog = await UserSession.findOne({ userID: user._id });

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
  let { refreshToken } = req.body;

  try {
    let decodeRefreshToken = verifyRefreshToken(refreshToken);

    let accessToken = generateJWTToken({
      id: decodeRefreshToken.id,
      userName: decodeRefreshToken.userName,
      email: decodeRefreshToken.email,
    });

    let userLog = await UserSession.findOne({ refreshToken: refreshToken });

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
