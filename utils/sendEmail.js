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

  // Email options with a detailed HTML signature
  const mailOptions = {
    from: "TRUSTNRIDE <team@trustnride.in>",
    to: options.email,
    subject: options.subject,
    html: `
      <p>${options.message}</p>
      <br>
      <p>----------------------------------------------------</p>
      <p style="font-size: 1.8em; font-weight: bold;">TRUST N RIDE</p> <!-- Larger size for TRUST N RIDE -->
      <p style="font-size: 1em; color: #0078D7;">TICK TOCK SOLD!!</p> <!-- Smaller size for TICK TOCK SOLD!! -->
      <img src="https://res.cloudinary.com/dztz5ltuq/image/upload/v1730227384/IMG-20241023-WA0010_p7ukjb.jpg" alt="TRUST N RIDE Logo" style="width:100px; height:auto; display:block; margin-top:10px;">
      <p><strong>Phone:</strong> 9792983625</p>
      <p>Gata Num- 57, near RING ROAD, near NEW JAIHERO, Akbarpur, Ratanpur, Uttar Pradesh 224122</p>
      <p>Akbarpur, Uttar Pradesh 228161</p>
      <p><strong>Website:</strong> <a href="https://www.trustnride.in/" target="_blank">www.trustnride.in</a></p>
      <br>
      <p><em>This email and its contents are confidential.</em></p>
    `,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
