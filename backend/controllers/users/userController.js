const User = require("../../models/users/userModel");

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
