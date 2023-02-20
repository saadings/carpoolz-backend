var User = require("../../models/users/userModel");
var Driver = require("../../models/users/driverModel");
var ActiveDriver = require("../../models/active-user/activeDriversModel");
var ActivePassenger = require("../../models/active-user/activePassengerModel");
const validationError = require("../../utils/errorHandling/validationError");
const serverError = require("../../utils/errorHandling/serverError");

exports.availablePassengers = async (req, res) => {
  const { userName } = req.body;
  try {
    if (!userName) {
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
      userID: driver._id,
    });

    if (!activeDriver)
      return res.status(400).json({
        success: false,
        code: -4,
        message: "Driver not active.",
      });

    var activePassengers = await ActivePassenger.find();

    if (!activePassengers)
      return res.status(400).json({
        success: false,
        code: -5,
        message: "No active passengers.",
      });

    // for (let i = 0; i < activePassengers.length; i++) {
    //   for (j < activePassengers[i].routes[0].legs[0].steps; j++) {

    //   }

    // }

    activePassengers.map(({ route }) => {
      route.legs.map(({ steps }) => {
        steps.map(({ step }) => {
          let polyline = step.polyline.encodedPolyline;
        });
      });
    });

    activePassengers.map(({ route }) => {
      route.legs.map(({ steps }) => {
        steps.map(({ step }) => {
          let polyline = step.polyline.encodedPolyline;
        });
      });
    });

    // var newActiveDriver = new ActiveDriver({
    //   userID: driver._id,
    //   origin: origin,
    //   destination: destination,
    //   route: route,
    // });

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

exports.activePassenger = async (req, res) => {
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

    var activeP = await ActivePassenger.findOne({
      userID: user._id,
    });

    if (activeP)
      return res.status(400).json({
        success: false,
        code: -4,
        message: "Passenger already active.",
      });

    var newActivePassenger = new ActivePassenger({
      userID: user._id,
      origin: origin,
      destination: destination,
      route: route,
    });

    try {
      await newActivePassenger.save();
    } catch (error) {
      return res.status(500).json(validationError(error));
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Passenger activated successfully.",
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};
