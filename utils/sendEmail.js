const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables from .env

const sendEmail = async (options) => {
  // Create a transporter object using GoDaddy SMTP
  const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net", // GoDaddy SMTP server
    port: 465, // Secure SSL port
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER, // Your GoDaddy email
      pass: process.env.EMAIL_PASS, // Your GoDaddy email password
    },
  });

  // Email options with attachment
  const mailOptions = {
    from: `"TRUST N RIDE" <team@trustnride.in>`, // Your GoDaddy email
    to: options.email,
    cc: "team@trustnride.in",
    subject: options.subject,
    html: `
      <p>${options.message}</p>
      <br>
      <p>-------------------------------------------------------------------------------------------</p>
      <p style="font-size: 1.8em; font-weight: bold;">TRUST N RIDE</p>
      <p style="font-size: 1em; color: #0078D7;">TICK TOCK SOLD!!</p>
      <img src="https://res.cloudinary.com/dztz5ltuq/image/upload/v1730227384/IMG-20241023-WA0010_p7ukjb.jpg" alt="TRUST N RIDE Logo" style="width:100px; height:auto; display:block; margin-top:10px;">
      <p><strong>📞 </strong> 9792983625</p>
      <p>📍 Gata Num- 57, Near Ring Road, Near New Jaihero,     Ratanpur, Akbarpur, Ambedkar Nagar, Uttar Pradesh, 224122</p>
     
      <p><strong>🌐 </strong> <a href="https://www.trustnride.in/" target="_blank">www.trustnride.in</a></p>
      <br>
      <p><em>This email and its contents are confidential.</em></p>
    `,
    attachments: options.attachmentPath
      ? [
          {
            filename: options.attachmentName || "document.pdf",
            path: options.attachmentPath,
          },
        ]
      : [],
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
