const User = require("../../models/users/userModel");
const Driver = require("../../models/users/driverModel");

exports.isDriver = async (req, res, next) => {
  const { userName } = req.body;

  var user = await User.findOne({
    userName: userName,
  });

  if (!user)
    return res.status(403).json({
      success: false,
      code: -2,
      message: "User not registered.",
    });

  var driver = await Driver.findOne({
    userID: user._id,
  });

  if (driver)
    return res.status(403).json({
      success: false,
      code: -2,
      message: "Driver already registered.",
    });

  next();
};
