module.exports = `<html>
<head>
  <title>Confirm Your Account Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      background-color: #f8f9fa;
      padding: 20px;
    }
    b {
      color: #007bff;
    }
    .container {
      background-color: #fff;
      border: 1px solid #dee2e6;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      padding: 30px;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo img {
      width: 150px;
    }
    .header {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="[company logo URL]" alt="[Company Name]">
    </div>
    <p class="header">Confirm Your Account Verification</p>
    <p>Dear [Name],</p>
    <p>Thank you for choosing our service! To complete your account setup, we need you to confirm your email address.</p>
    <p>Please enter the following OTP (One Time Password) code in your account settings to verify your email address: <b>[insert OTP code here]</b>.</p>
    <p>This OTP is valid for the next 10 minutes, so please enter it as soon as possible to avoid any delays in accessing your account.</p>
    <p>If you did not request this verification, please let us know immediately so we can secure your account.</p>
    <p>Thank you for your cooperation and enjoy our services!</p>
    <p>Best regards,</p>
    <p>[Your Name]<br>[Company Name]</p>
  </div>
</body>
</html>`;
