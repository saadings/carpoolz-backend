var express = require("express");
var router = express.Router();

const socketEmissionController = require("../controllers/socket-emission/socketEmissionController");
const { isJWTValid } = require("../middlewares/user-auth/userAuthMiddleware");

router.post("/emit", isJWTValid, socketEmissionController.socketEmit);

module.exports = router;
