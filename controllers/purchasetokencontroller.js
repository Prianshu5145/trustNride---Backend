const PurchaseToken = require('../models/purchasetoken');
const {purchasetokenwhatsapp} = require('../utils/purchasewhatsapp');
const fs = require('fs')
// Controller to create a new purchase token
exports.createPurchaseToken = async (req, res) => {
  try {
    // Destructure the data from the request body
    const {
      ownerName,
      ownerWhatsApp,
      carTitle,
      carRegistrationNumber,
      tokenAmount,
      approxDealAmount,
      address,
      carModel
    } = req.body;
    console.log(req.body); // Log the incoming request body to check the data

    // Validate the incoming data
   

    // Ensure the pickupDate is a valid date
    
    // Create a new purchase token instance
    const newPurchaseToken = new PurchaseToken({
      ownerName,
      ownerWhatsApp,
      carTitle,
      carRegistrationNumber,
      tokenAmount,
      approxDealAmount,
      address,
      carModel
    });

    // Save the token in the database
    const savedToken = await newPurchaseToken.save();
  

    async function makeRequest() {
      try {

          const phoneNumberId = process.env.phoneNumberId; // Replace with your actual phone number ID
          const messagingProduct = 'whatsapp'; // Replace with your actual messaging product
          const file = fs.createReadStream(req.file.path); // Replace with the path to your file
  
      
          const response = await purchasetokenwhatsapp(phoneNumberId, messagingProduct,file,ownerName,
            ownerWhatsApp,
            carTitle,
            carRegistrationNumber,
            address,
            );
  
          console.log('Media upload response:', response);
      } catch (error) {
          console.error('Error during request:', error);
      }
  }
  
  makeRequest(); 
    // Return success response
    return res.status(201).json({ message: 'Purchase token created successfully!', data: savedToken });

  } catch (error) {
    // Catch any errors and return a 500 status with the error message
    console.error(error);  // Log the error for debugging
    return res.status(500).json({ message: 'Error creating purchase token', error: error.message });
  }
};

// Controller to fetch all purchase tokens
exports.getAllPurchaseTokens = async (req, res) => {
  try {
    const tokens = await PurchaseToken.find();
    return res.status(200).json({ data: tokens });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching purchase tokens', error: error.message });
  }
};


// get no no token count
exports.getpurchaseTokenCount = async (req, res) => {
  try {
    // Count all documents in the Token collection
    const tokenpurchaseCount = await PurchaseToken.countDocuments();
    
    // Send the response with the count
    res.status(200).json({
      success: true,
      message: 'Token count fetched successfully',
      count: tokenpurchaseCount,
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