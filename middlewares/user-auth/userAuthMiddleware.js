const {
  isJWTStillValid,
  isRefreshTokenStillValid,
} = require("../../utils/services/jwt");
const UserSession = require("../../models/user-session/userSessionModel");

exports.isJWTExpired = async (req, res, next) => {
  let bearerHeader = req.headers["authorization"];
  let refreshToken = req.body.refreshToken;

  if (typeof bearerHeader === "undefined" || !refreshToken)
    return res.status(403).json({
      success: false,
      code: -1,
      message: "Tokens not present.",
    });

  let bearer = bearerHeader.split(" ");
  let bearerToken = bearer[1];

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

  let userLog = await UserSession.findOne({
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

exports.isJWTValid = async (req, res, next) => {
  let bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader === "undefined")
    return res.status(403).json({
      success: false,
      code: -1,
      message: "JWT not present.",
    });

  let bearer = bearerHeader.split(" ");
  let bearerToken = bearer[1];

  if (!isJWTStillValid(bearerToken))
    return res.status(403).json({
      success: false,
      code: -2,
      message: "JWT expired.",
    });
  
  let userLog = await UserSession.findOne({accessToken: bearerToken})
  if (!userLog)
    return res.status(403).json({
      success: false,
      code: -3,
      message: "User not logged in.",
    });
  req.token = bearerToken;

  next();
};
