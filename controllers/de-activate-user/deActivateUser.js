let ActiveDriver = require("../../models/active-user/activeDriversModel");
let ActivePassenger = require("../../models/active-user/activePassengerModel");

exports.deActivateDriver = async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });

    let user = await ActiveDriver.findOneAndDelete({
      userName: userName,
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User not activated.",
      });

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Driver de-activated successfully.",
    });
  } catch (err) {
    return res.status(500).json(serverError());
  }
};

exports.deActivatePassenger = async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });

    let user = await ActivePassenger.findOneAndDelete({
      userName: userName,
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User not activated.",
      });

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Passenger de-activated successfully.",
    });
  } catch (err) {
    return res.status(500).json(serverError());
  }
};
