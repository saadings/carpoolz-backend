let User = require("../../models/users/userModel");
let Driver = require("../../models/users/driverModel");
let ActiveDriver = require("../../models/active-user/activeDriversModel");
let ActivePassenger = require("../../models/active-user/activePassengerModel");
const validationError = require("../../utils/error-handling/validationError");
const serverError = require("../../utils/error-handling/serverError");
const {
  routeComparison,
} = require("../../utils/route-comparison/routeComparison");

exports.activateDriver = async (req, res) => {
  const { userName, origin, destination, route } = req.body;

  try {
    if (!userName || !origin || !destination || !route) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });
    }
    // console.log(req.body);
    let user = await User.findOne({
      userName: userName,
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User not registered.",
      });

    let driver = await Driver.findOne({
      userID: user._id,
    });

    if (!driver)
      return res.status(400).json({
        success: false,
        code: -3,
        message: "Driver not registered.",
      });

    let activeDriver = await ActiveDriver.findOne({
      userName: user.userName,
    });

    if (activeDriver)
      return res.status(400).json({
        success: false,
        code: -4,
        message: "Driver already active.",
      });

    let newActiveDriver = new ActiveDriver({
      userName: userName,
      origin: origin,
      destination: destination,
      route: route,
    });

    try {
      await newActiveDriver.save();
    } catch (error) {
      return res.status(500).json(validationError(error));
    }

    let activePassengers = await ActivePassenger.find({});

    let passengerList = routeComparison(
      newActiveDriver.route,
      activePassengers
    );

    console.log(passengerList);

    const io = req.app.locals.io;

    passengerList.map((passenger) => {
      io.emit(passenger, {
        userName: newActiveDriver.userName,
        origin: newActiveDriver.origin,
        destination: newActiveDriver.destination,
      });
    });

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Driver activated successfully.",
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};

exports.activatePassenger = async (req, res) => {
  const { userName, origin, destination, route } = req.body;
  try {
    if (!userName || !origin || !destination || !route) {
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
        message: "User not registered.",
      });

    let activeP = await ActivePassenger.findOne({
      userID: user._id,
    });

    if (activeP)
      return res.status(400).json({
        success: false,
        code: -4,
        message: "Passenger already active.",
      });

    let newActivePassenger = new ActivePassenger({
      userName: userName,
      origin: origin,
      destination: destination,
      route: route,
    });

    try {
      await newActivePassenger.save();
    } catch (error) {
      return res.status(500).json(validationError(error));
    }

    let activeDrivers = await ActiveDriver.find({});

    let driverList = routeComparison(newActivePassenger.route, activeDrivers);

    const driverDataList = activeDrivers.map((driver) => {
      if (driverList.includes(driver.userName)) {
        return {
          userName: driver.userName,
          origin: driver.origin,
          destination: driver.destination,
        };
      }
    });

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Passenger activated successfully.",
      data: driverDataList,
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};
