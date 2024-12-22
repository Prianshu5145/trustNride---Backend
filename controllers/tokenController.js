const Token = require('../models/token'); // Assuming you have a Token model for storing data
const cloudinary = require("../utils/cloudinary2");
const { sendMessage } = require('../utils/whatsapp');
const { uploadMediaAndSendMessage } = require('../utils/whatsapp'); // Adjust the path as needed
const fs = require('fs');
// Configure Cloudinary
require('dotenv').config();

// Controller to handle the token form submission
exports.submitTokenForm = async (req, res) => {
  try {
    const {
      carTitle,
      carModel,
      customerName,
      customerMobile,
      whatsappMobile,
      customerAddress,
      customerEmail,
      tokenAmount,
      dateOfPaymentReceived,
      paymentMode,
      paymentTo,
      dealDoneAmount,
      fairMarketValue,
      carRegistrationNumber,
      loanOrCash,
    } = req.body;

    // Check if a PDF file is included in the request
    

    let pdfUrl = null;
    
    if (req.file) {
      try {
        // Upload the PDF file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: 'raw', // Ensure it's handled as a raw file
          folder: 'trustnride/tokens', // Organize files into a specific folder
        });
    
        pdfUrl = result.secure_url; // Get the secure URL of the uploaded PDF
        console.log('PDF uploaded successfully:', pdfUrl);
      } catch (error) {
        console.error('Error uploading PDF to Cloudinary:', error);
        throw new Error('PDF upload failed'); // Handle the error gracefully
      }
    }
    
    // Use pdfUrl as needed
    

    // Create a new token entry
    const token = new Token({
      carTitle,
      carModel,
      customerName,
      customerMobile,
      whatsappMobile,
      customerAddress,
      customerEmail,
      tokenAmount,
      dateOfPaymentReceived,
      paymentMode,
      paymentTo,
      dealDoneAmount,
      fairMarketValue,
      carRegistrationNumber,
      loanOrCash,
      pdfFileUrl: pdfUrl, // Save the Cloudinary PDF URL in the database
    });
    
    
    // Save to the database
    await token.save();
    async function makeRequest() {
        try {

            const phoneNumberId = process.env.phoneNumberId; // Replace with your actual phone number ID
            const messagingProduct = 'whatsapp'; // Replace with your actual messaging product
            const file = fs.createReadStream(req.file.path); // Replace with the path to your file
    
        const CustomerMessage1  =    `*Congratulations from TRUST N RIDE!* 🎉\nWe’re excited to welcome you to the TRUST N RIDE family! Congratulations on tokening your dream car ✨🚘—it’s now yours! *We’re thrilled to be part of your journey, and we’re sure this car will bring you countless memories and adventures.*`
          const CustomerMessage2 =  `Here are the details of your car:\n*Car*: ${carTitle}\n*Model*:${carModel}\n*Deal Amount*: ${dealDoneAmount}+Rto Charges\n*Token Amount*: ${tokenAmount}\n*Fair Market Value*: *${fairMarketValue}*\n*Your token invoice is attached below for your reference.*\nThank you again for choosing TRUST N RIDE. If you need any further assistance, don’t hesitate to reach out!`    
           const ownerMessage = `*Hurray, TEAM TRUST N RIDE! 🎉*\nAnother car successfully *tokenized!* 🚘✨ Let's keep up the pace and accelerate towards even bigger wins!\n*Car*: ${carTitle}\n*REG NO*:${carRegistrationNumber}\n*Model*:${carModel}\n*Deal Amount*: ${dealDoneAmount}\n*Token Amount*: ${tokenAmount}\n*Pay to*:${paymentTo}\n*Payment Mode*:${paymentMode}\n*Customer Name*:${customerName}\n*Customer Adress*:${customerAddress}\n*Payment of Remaining Amount By*:${loanOrCash}\n*Invoice attached.Let’s continue the momentum!*`
            const response = await uploadMediaAndSendMessage(phoneNumberId, messagingProduct,CustomerMessage1,CustomerMessage2,ownerMessage, file,whatsappMobile);
    
            console.log('Media upload response:', response);
        } catch (error) {
            console.error('Error during request:', error);
        }
    }
    
    makeRequest(); 
    return res.status(201).json({
      message: 'Token application submitted successfully!',
      token,
    });
  } catch (error) {
    console.error('Error submitting token form:', error);
    return res.status(500).json({
      message: 'Server error, please try again later.',
      error: error.message,
    });
  }
};
// Controller to get the count of all saved tokens
exports.getTokenCount = async (req, res) => {
  try {
    // Count all documents in the Token collection
    const tokenCount = await Token.countDocuments();
    
    // Send the response with the count
    res.status(200).json({
      success: true,
      message: 'Token count fetched successfully',
      count: tokenCount,
    });
  } catch (error) {
    console.error('Error fetching token count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch token count',
      error: error.message,
    });
  }
};



