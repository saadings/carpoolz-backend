var User = require("../../models/users/userModel");
var User = require("../../models/users/userModel");
var Driver = require("../../models/users/driverModel");

exports.registerDriver = async (req, res) => {
  const { userName, cnic, licenseNo } = req.body;
  try {
    if (!userName || !cnic || !licenseNo) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });
    }

    var user = await User.findOne({
      userName: userName,
    });
    if (!user)
      return res.status(403).json({
        success: false,
        code: -2,
        message: "User does not exist.",
      });

    var driver = await Driver.findOne({
      userID: user._id,
    });

    if (driver)
      return res.status(403).json({
        success: false,
        code: -3,
        message: "Driver already exist.",
      });

    var newDriver = new Driver({
      userID: user._id,
      cnic: cnic,
      licenseNo: licenseNo,
      rating: 0.0,
    });

    try {
      await newDriver.save();
    } catch (error) {
      return res.status(400).json(validationError(error));
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Driver created successfully.",
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};

// exports.switchToDriver = async (req, res) => {
//   const { userName } = req.body;
//   try {
//     if (!userName) {
//       return res.status(400).json({
//         success: false,
//         code: -1,
//         message: "Please provide all the required fields.",
//       });
//     }
//     var user = await User.findOne({
//       userName: userName,
//     });
//     if (!user)
//       return res.status(403).json({
//         success: false,
//         code: -2,
//         message: "User does not exist.",
//       });

//     var driver = await Driver.findOne({
//       userID: user._id,
//     });

//     if (!driver)
//       return res.status(403).json({
//         success: false,
//         code: -3,
//         message: "Driver does not exist.",
//       });

//     return res.status(201).json({
//       success: true,
//       code: 0,
//       message: "Driver created successfully.",
//     });
//   } catch (error) {
//     return res.status(500).json(serverError());
//   }
// };
