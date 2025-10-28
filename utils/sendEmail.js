const fs = require("fs");
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.EMAIL_API_KEY);

const sendEmail = async (options) => {
  try {
    let attachments = [];

    // Encode attachment as Base64 if available
    if (options.attachmentPath) {
      const pdfBuffer = fs.readFileSync(options.attachmentPath);
      const pdfBase64 = pdfBuffer.toString("base64");

      attachments.push({
        filename: options.attachmentName || "document.pdf",
        content: pdfBase64,
      });
    }

    // Send email using Resend API
    const { data, error } = await resend.emails.send({
      from: "TRUST N RIDE <team@trustnride.in>",
      to: [options.email],
      cc: ["support@trustnride.in"],
      subject: options.subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
          <p>${options.message}</p>
          <br>
          <hr style="border: 0; border-top: 1px solid #ddd;">
          <p style="font-size: 1.8em; font-weight: bold;">TRUST N RIDE</p>
          <p style="font-size: 1em; color: #0078D7;">TICK TOCK SOLD!!</p>

          <img 
            src="https://res.cloudinary.com/dztz5ltuq/image/upload/v1730227384/IMG-20241023-WA0010_p7ukjb.jpg" 
            alt="TRUST N RIDE Logo" 
            style="width:120px; height:auto; display:block; margin-top:10px;"
          >

          <p style="margin-top:10px;"><strong>📞</strong> 9792983625</p>
          <p>📍 Gata Num-57, Near Ring Road, Near New Jaihero,<br> Ratanpur, Akbarpur, Ambedkar Nagar, Uttar Pradesh, 224122</p>

          <p><strong>🌐</strong> <a href="https://www.trustnride.in/" target="_blank">www.trustnride.in</a></p>
          <br>
          <p style="font-size: 0.9em; color: #555;"><em>This email and its contents are confidential.</em></p>
        </div>
      `,
      attachments,
    });

    if (error) {
      console.error("❌ Error sending email:", error);
      throw new Error(error.message);
    }

    console.log("✅ Email sent successfully:", data);
  } catch (err) {
    console.error("❌ sendEmail failed:", err.message);
  }
};

module.exports = sendEmail;
