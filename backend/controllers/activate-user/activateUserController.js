var User = require("../../models/users/userModel");
var Driver = require("../../models/users/driverModel");
var ActiveDriver = require("../../models/active-user/activeDriversModel");
const validationError = require("../../utils/errorHandling/validationError");

exports.activeDriver = async (req, res) => {
  const { userName, origin, destination, route } = req.body;
  try {
    if (!userName || !origin || !destination || !route) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });
    }

    var user = await User.findOne({
      userName: userName,
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User not registered.",
      });

    var driver = await Driver.findOne({
      userID: user._id,
    });

    if (!driver)
      return res.status(400).json({
        success: false,
        code: -3,
        message: "Driver not registered.",
      });

    var activeDriver = await ActiveDriver.findOne({
      driverID: driver._id,
    });

    if (activeDriver)
      return res.status(400).json({
        success: false,
        code: -4,
        message: "Driver already active.",
      });

    var newActiveDriver = new ActiveDriver({
      userID: driver._id,
      origin: origin,
      destination: destination,
      route: route,
    });

    try {
      await newActiveDriver.save();
    } catch (error) {
      return res.status(500).json(validationError(error));
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Driver activated successfully.",
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};
