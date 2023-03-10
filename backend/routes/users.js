var express = require("express");
var router = express.Router();

const userController = require("../controllers/users/userController");
const {
  isJWTExpired,
  isJWTValid,
} = require("../middlewares/user-auth/userAuthMiddleware");
/* GET users listing. */
router.post("/register", userController.registerUser);
router.post("/verify/otp", userController.verifyOTP);
router.post("/resend/otp", userController.resendOTP);
router.post("/login", userController.loginUser);
router.post("/logout", isJWTValid, userController.logoutUser);
router.post("/refresh/token", isJWTExpired, userController.refreshToken);

module.exports = router;
