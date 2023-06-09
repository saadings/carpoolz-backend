let serverError = require("../../utils/error-handling/serverError");
const ActivePassenger = require("../../models/active-user/activePassengerModel");
const PassengerTripsModel = require("../../models/trip-history/passengerTripsModel");
const InitiateRideModel = require("../../models/ride/initiateRideModel");
const validationError = require("../../utils/error-handling/validationError");
const UserModel = require("../../models/users/userModel");

exports.startPassengerTrip = async (req, res) => {
  try {
    const { userName, source, destination } = req.body;

    if (!userName || !source || !destination)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });

    let user = await ActivePassenger.findOneAndDelete({
      userName: userName,
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User not activated.",
      });

    const trip = new InitiateRideModel({
      source: source,
      destination: destination,
      rating: 0.0,
    });

    try {
      await trip.save();
    } catch (err) {
      return res.status(500).json(validationError(err));
    }

    user = await UserModel.findOne({ userName: userName });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -3,
        message: "User not found.",
      });

    const passengerTrip = new PassengerTripsModel({
      fare: 0,
      distance: 0,
      tripID: trip._id,
      userID: user._id,
    });

    try {
      await passengerTrip.save();
    } catch (err) {
      return res.status(500).json(validationError(err));
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Passenger trip started successfully.",
    });
  } catch (err) {
    return res.status(500).json(serverError());
  }
};
