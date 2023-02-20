const nodemailer = require("nodemailer");
const { resolve, join } = require("path");
require("dotenv").config({
  path: resolve(__dirname, "../config/.env"),
});
const otpEmailTemplate = require("../../assets/otpEmailTemplate");

module.exports = async (receiver, otp, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_APP_PASS,
    },
  });

  let imagePath = join(__dirname, "../../assets", "carpoolz.png");
  let imagePath2 = join(__dirname, "../../assets", "carpoolz-tag.png");

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: receiver,
    subject: "Carpoolz OTP",
    html: otpEmailTemplate(otp, name),
    attachments: [
      {
        filename: "carpoolz.png",
        path: imagePath,
        cid: "image",
      },
      {
        filename: "carpoolz-tag.png",
        path: imagePath2,
        cid: "image2",
      },
    ],
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
