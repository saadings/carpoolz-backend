var express = require("express");
var router = express.Router();

const activeUserController = require("../controllers/activate-user/activateUserController");
const { isJWTValid } = require("../middlewares/jwt/jwtMiddleware");

router.post("/driver", isJWTValid, activeUserController.activeDriver);
router.post("/passenger", isJWTValid);

module.exports = router;
