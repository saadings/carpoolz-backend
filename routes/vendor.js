var express = require("express");
var router = express.Router();

const vendorController = require("../controllers/vendor/vendorController");
const { isVendor } = require("../middlewares/vendor-auth/vendorAuthMiddleware");
const { isJWTValid } = require("../middlewares/user-auth/userAuthMiddleware");

/* GET users listing. */
router.post("/register", isJWTValid, isVendor, vendorController.registerVendor);
router.post("/register/store", isJWTValid, vendorController.registerStore);
module.exports = router;
