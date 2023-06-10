const User = require("../../models/users/userModel");
const Vendor = require("../../models/users/vendorModel");

exports.isVendor = async (req, res, next) => {
  const { userName } = req.body;

  let user = await User.findOne({
    userName: userName,
  });

  if (!user)
    return res.status(403).json({
      success: false,
      code: -2,
      message: "User not registered.",
    });

  let driver = await Vendor.findOne({
    userID: user._id,
  });

  if (driver)
    return res.status(403).json({
      success: false,
      code: -2,
      message: "Vendor already registered.",
    });

  next();
};
