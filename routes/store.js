var express = require("express");
var router = express.Router();

// const vendorController = require("../controllers/vendor/vendorController");

const storeController = require("../controllers/store/storesController");

const { isJWTValid } = require("../middlewares/user-auth/userAuthMiddleware");

/* GET users listing. */
router.post("/all", isJWTValid, storeController.stores);
router.post("/deals", isJWTValid, storeController.deals);
router.post("/deals/add", isJWTValid, storeController.addDeals);
// router.post("/register/store", isJWTValid, vendorController.registerStore);
module.exports = router;
