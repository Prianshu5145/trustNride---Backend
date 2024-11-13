const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env

const sendEmail = async (options) => {
  // Create a transporter object using GoDaddy SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net', // GoDaddy SMTP server
    port: 465, // or 587
    secure: true, // true for port 465, false for port 587
    auth: {
      user: process.env.EMAIL_USER, // Email from .env (your GoDaddy email)
      pass: process.env.EMAIL_PASS, // Email password from .env
    },
  });

  // Email options
  const mailOptions = {
    from: "TRUSTNRIDE <team@trustnride.in>",  // Sender address
    to: options.email,  // Recipient(s)
    subject: options.subject,  // Subject line
    text: options.message,  // Plain text body
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
