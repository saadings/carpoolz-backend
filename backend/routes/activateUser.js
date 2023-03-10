var express = require("express");
var router = express.Router();

const activeUserController = require("../controllers/activate-user/activateUserController");
const { isJWTValid } = require("../middlewares/user-auth/userAuthMiddleware");

router.post("/driver", isJWTValid, activeUserController.activateDriver);
router.post("/passenger", isJWTValid, activeUserController.activatePassenger);

module.exports = router;
