var express = require("express");
var router = express.Router();

const userController = require("../controllers/users/userController");
const { isJWTValid } = require("../middlewares/jwt/jwtMiddleware");

router.post("/driver", isJWTValid);
router.post("/passenger", isJWTValid);

module.exports = router;
