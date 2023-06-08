var express = require("express");
var router = express.Router();

const deActivateController = require("../controllers/de-activate-user/deActivateUser");
const { isJWTValid } = require("../middlewares/user-auth/userAuthMiddleware");

router.delete("/driver", isJWTValid, deActivateController.deActivateDriver);
router.delete(
  "/passenger",
  isJWTValid,
  deActivateController.deActivatePassenger
);

module.exports = router;
