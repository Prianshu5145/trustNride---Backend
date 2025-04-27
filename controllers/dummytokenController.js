const DummyToken = require('../models/dummytoken'); // Assuming you have a Token model for storing data

require('dotenv').config();

// Controller to handle the token form submission
exports.submitdummyTokenForm = async (req, res) => {
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
    
    
    
    // Use pdfUrl as needed
    

    // Create a new token entry
    const token = new DummyToken({
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
       // Save the Cloudinary PDF URL in the database
    });
    
    
    // Save to the database
    await token.save();
   

     
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
exports.getTokendummyCount = async (req, res) => {
  try {
    // Count all documents in the Token collection
    const tokenCount = await DummyToken.countDocuments();
    
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



