let User = require("../../models/users/userModel");
let Driver = require("../../models/users/driverModel");
let Vehicle = require("../../models/vehicle/vehicleModel");
const validationError = require("../../utils/error-handling/validationError");
const serverError = require("../../utils/error-handling/serverError");

exports.registerDriver = async (req, res) => {
  const { userName, cnic, licenseNo } = req.body;
  try {
    if (!userName || !cnic || !licenseNo) {
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
      return res.status(403).json({
        success: false,
        code: -2,
        message: "User is not registered.",
      });

    let driver = await Driver.findOne({
      userID: user._id,
    });

    if (driver)
      return res.status(403).json({
        success: false,
        code: -3,
        message: "Driver already registered.",
      });

    let newDriver = new Driver({
      userID: user._id,
      cnic: cnic,
      licenseNo: licenseNo,
      rating: 0.0,
    });

    try {
      await newDriver.save();
    } catch (error) {
      return res.status(400).json(validationError(error));
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

exports.registerVehicle = async (req, res) => {
  const {
    userName,
    vehicleType,
    vehicleNumber,
    vehicleModel,
    vehicleColor,
    numOfSeats,
  } = req.body;
  try {
    if (
      !userName ||
      !vehicleType ||
      !vehicleNumber ||
      !vehicleModel ||
      !vehicleColor ||
      !numOfSeats
    ) {
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
      return res.status(403).json({
        success: false,
        code: -2,
        message: "User is not registered.",
      });

    let driver = await Driver.findOne({
      userID: user._id,
    });

    if (!driver)
      return res.status(403).json({
        success: false,
        code: -3,
        message: "Driver does not registered.",
      });

    let vehicle = await Vehicle.findOne({
      vehicleNumber: vehicleNumber,
    });

    if (vehicle)
      return res.status(403).json({
        success: false,
        code: -4,
        message: "Vehicle already registered.",
      });

    let newVehicle = new Vehicle({
      driverID: driver._id,
      vehicleType: vehicleType,
      vehicleNumber: vehicleNumber,
      vehicleModel: vehicleModel,
      vehicleColor: vehicleColor,
      numOfSeats: numOfSeats,
    });

    try {
      await newVehicle.save();
    } catch (error) {
      return res.status(400).json(validationError(error));
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Vehicle registered successfully.",
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};
