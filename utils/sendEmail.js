const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

const sendEmail = async (options) => {
  // Create a transporter object using Gmail (you can use other email providers)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "agraharipriyanshu53@gmail.com", // Your email
      pass: "iarmdhyxlsomohub", // Your email password
    },
  });

  // Email options
  const mailOptions = {
    from: "TRUSTNRIDE", // Sender address
    to: options.email,            // List of recipients
    subject: options.subject,     // Subject line
    text: options.message,        // Plain text body
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
