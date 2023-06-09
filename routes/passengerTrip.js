var express = require("express");
var router = express.Router();

const passengerTripController = require("../controllers/trip/passengerTrip");
const { isJWTValid } = require("../middlewares/user-auth/userAuthMiddleware");

router.post(
  "/passenger",
  isJWTValid,
  passengerTripController.startPassengerTrip
);

module.exports = router;
