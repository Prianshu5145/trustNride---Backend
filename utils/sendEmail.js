const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env

const sendEmail = async (options) => {
  // Create a transporter object using Gmail (or another email provider)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Email from .env
      pass: process.env.EMAIL_PASS, // Email password from .env
    },
  });

  // Email options
  const mailOptions = {
    from: "TRUSTNRIDE",        // Sender address
    to: options.email,         // Recipient(s)
    subject: options.subject,  // Subject line
    text: options.message,     // Plain text body
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
