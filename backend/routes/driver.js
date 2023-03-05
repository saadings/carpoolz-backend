var express = require("express");
var router = express.Router();

const driverController = require("../controllers/driver/driverController");
const { isDriver } = require("../middlewares/driver-auth/driverAuthMiddleware");
const { isJWTValid } = require("../middlewares/user-auth/userAuthMiddleware");
/* GET users listing. */
router.post("/register", isJWTValid, isDriver, driverController.registerDriver);
router.post("/register/vehicle", isJWTValid, driverController.registerVehicle);
module.exports = router;
