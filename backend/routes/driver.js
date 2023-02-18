var express = require("express");
var router = express.Router();

const driverController = require("../controllers/driver/driverController");
const { isDriver } = require("../middlewares/driver-auth/driverMiddleware");
const { isJWTValid } = require("../middlewares/jwt/jwtMiddleware");
/* GET users listing. */
router.post("/register", isJWTValid, isDriver, driverController.registerDriver);
router.post("/register/vehicle", isJWTValid, driverController.registerVehicle);
module.exports = router;
