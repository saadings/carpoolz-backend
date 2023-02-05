var express = require("express");
var router = express.Router();

const userController = require("../controllers/users/userController");

/* GET users listing. */
router.get("/register", userController.registerUser);

module.exports = router;
