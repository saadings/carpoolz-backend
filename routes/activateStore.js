var express = require("express");
var router = express.Router();

const activateStore = require("../controllers/activate-store/activateStoreController");
const { isJWTValid } = require("../middlewares/user-auth/userAuthMiddleware");

router.post("/passenger", isJWTValid, activateStore.passenger);

module.exports = router;
