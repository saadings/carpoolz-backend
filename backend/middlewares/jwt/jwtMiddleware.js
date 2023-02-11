const {
  isJWTStillValid,
  isRefreshTokenStillValid,
} = require("../../utils/services/jwt");
const UserSession = require("../../models/user-session/userSessionModel");

exports.isJWTExpired = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const refreshToken = req.body.refreshToken;

  if (typeof bearerHeader === "undefined" || !refreshToken)
    return res.status(403).json({
      success: false,
      code: -1,
      message: "Tokens not present.",
    });

  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  if (isJWTStillValid(bearerToken))
    return res.status(403).json({
      success: false,
      code: -2,
      message: "JWT not expired.",
    });

  if (!isRefreshTokenStillValid(refreshToken))
    return res.status(403).json({
      success: false,
      code: -3,
      message: "Refresh token expired.",
    });

  var userLog = await UserSession.findOne({
    accessToken: bearerToken,
    refreshToken: refreshToken,
  });

  if (!userLog)
    return res.status(400).json({
      success: false,
      code: -4,
      message: "User not logged in.",
    });

  // if (
  //   bearerToken !== userLog.accessToken ||
  //   refreshToken !== userLog.refreshToken
  // )
  //   return res.status(400).json({
  //     success: false,
  //     code: -5,
  //     message: "Invalid tokens.",
  //   });

  // req.accessToken = bearerToken;

  next();
};

exports.isJWTValid = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader === "undefined")
    return res.status(403).json({
      success: false,
      code: -1,
      message: "JWT not present.",
    });

  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  if (!isJWTStillValid(bearerToken))
    return res.status(403).json({
      success: false,
      code: -2,
      message: "JWT expired.",
    });

  req.token = bearerToken;

  next();
};
