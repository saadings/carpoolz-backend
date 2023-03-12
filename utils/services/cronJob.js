let cron = require("node-cron");
let User = require("../../models/users/userModel");
let UserOTP = require("../../models/user-otp/userOTPModel");

module.exports = cron.schedule("0 0 0 * * 1", async () => {
  console.log("Cron Running");

  // Deleting User who isn't active and their OTPs
  await User.deleteMany({ active: false });
});
