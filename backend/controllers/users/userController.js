const User = require("../../models/users/userModel");
var bcrypt = require("bcryptjs");

exports.registerUser = (req, res) => {
  const user = new User({
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    contactNumber: req.body.contactNumber,
    gender: req.body.gender,
    image: req.body?.image,
    rating: 0.0,
    active: false,
  });

  user
    .save()
    .then(() => res.json("User registered successfully"))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");
  else {
    res.json("Login Successfully");
  }
};
