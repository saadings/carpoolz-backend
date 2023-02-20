var express = require("express");
var router = express.Router();

// const activeUserController = require("../controllers/activate-user/activateUserController");
const { isJWTValid } = require("../middlewares/jwt/jwtMiddleware");

router.post("/drivers", isJWTValid);
router.post("/passengers", isJWTValid);

module.exports = router;
