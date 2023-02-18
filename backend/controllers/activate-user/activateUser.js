var User = require("../../models/users/userModel");
var Driver = require("../../models/users/driverModel");

exports.activeDriver = async (req, res) => {
  const { userName, cnic, licenseNo } = req.body;
  try {
    if (!userName || !cnic || !licenseNo) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Driver created successfully.",
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};
