let serverError = require("../../utils/error-handling/serverError");
let User = require("../../models/users/userModel");
let Passenger = require("../../models/trip-history/passengerTripsModel");
let Trip = require("../../models/ride/initiateRideModel");
let Store = require("../../models/store/storeModel");
let {
  routeRadiusComparison,
} = require("../../utils/radius-comparison/radiusComparison");

exports.passenger = async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });

    let user = await User.findOne({
      userName: userName,
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User not registered.",
      });

    let passenger = await Passenger.findOne({
      userID: user._id,
    });

    if (!passenger)
      return res.status(400).json({
        success: false,
        code: -3,
        message: "User not activated.",
      });

    let trip = await Trip.findOne({
      _id: passenger.tripID,
    });

    // console.log(trip);

    let stores = await Store.find({});
    // console.log(stores);

    let results = routeRadiusComparison(trip.route, stores);

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Driver de-activated successfully.",
      data: results,
    });
  } catch (err) {
    return res.status(500).json(serverError());
  }
};
