const nodemailer = require("nodemailer");
const { resolve } = require("path");
require("dotenv").config({
  path: resolve(__dirname, "../config/.env"),
});
const otpEmailTemplate = require("../../assets/otpEmailTemplate");

module.exports = async (receiver, otp, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_APP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: receiver,
    subject: "Carpoolz OTP",
    html: otpEmailTemplate(otp, name),
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: " + info.response);

      return true;
      // do something useful
    }
  });
};
