const PurchaseDeal = require('../models/PurchaseDeal'); // Assuming you have a Token model for storing data
const cloudinary = require("../utils/cloudinary2");
const sendEmail = require('../utils/sendEmail');
const { uploadMediaAndSendMessagePurchaseDeal } = require('../utils/whatsappPurchaseDeal'); // Adjust the path as needed
const fs = require('fs');
// Configure Cloudinary
require('dotenv').config();

// Controller to handle the token form submission
exports.submitPurchaseDealForm = async (req, res) => {
  try {
    const {
        carTitle,
        carModel,
        customerName,
        customerMobile,
        whatsappMobile,
        customerEmail,
        tokenAmount,
        challanAmount,
        dealDoneAmount,
        carRegistrationNumber,
        NocHoldbackAmount,
    PartipeshiHoldbackAmount,
    CxBankPaidAmount,
    AccountholderName,
    BankACCNo,
    BankIfsc,
    CxBankName,
    LoanPaymentAmount,
    LoanPaidBy,
    LoanpaymentStatus,
     CashAmount,
     DueAmount,
     PickUpRecievedGD,
     AfterPickUpReceivableGD
    } = req.body;

    // Check if a PDF file is included in the request
    

    let pdfUrl = null;
    
   
    
    // Use pdfUrl as needed
    

    // Create a new token entry
    const purchasedeal = new PurchaseDeal({
        carTitle,
        carModel,
        customerName,
        customerMobile,
        whatsappMobile,
        customerEmail,
        tokenAmount,
        challanAmount,
        dealDoneAmount,
        carRegistrationNumber,
        NocHoldbackAmount,
    PartipeshiHoldbackAmount,
    CxBankPaidAmount,
    AccountholderName,
    BankACCNo,
    BankIfsc,
    CxBankName,
    LoanPaymentAmount,
    LoanPaidBy,
    LoanpaymentStatus,
     CashAmount,
     DueAmount,
     PickUpRecievedGD,
     AfterPickUpReceivableGD,
      // Save the Cloudinary PDF URL in the database
    });
    
    
    // Save to the database
    await purchasedeal.save();

     async function makeRequest() {
            try {
    
                const phoneNumberId = process.env.phoneNumberId; // Replace with your actual phone number ID
                const messagingProduct = 'whatsapp'; // Replace with your actual messaging product
                const file = fs.createReadStream(req.file.path); // Replace with the path to your file
        
            // const CustomerMessage1  =    `*Congratulations from TRUST N RIDE!* 🎉\nWe’re excited to welcome you to the TRUST N RIDE family! Congratulations on tokening your dream car ✨🚘—it’s now yours! *We’re thrilled to be part of your journey, and we’re sure this car will bring you countless memories and adventures.*`
             // const CustomerMessage2 =  `Here are the details of your car:\n*Car*: ${carTitle}\n*Model*:${carModel}\n*Deal Amount*: ${dealDoneAmount}+Rto Charges\n*Token Amount*: ${tokenAmount}\n*Fair Market Value*: *${fairMarketValue}*\n*Your token invoice is attached below for your reference.*\nThank you again for choosing TRUST N RIDE. If you need any further assistance, don’t hesitate to reach out!`    
             //  const ownerMessage = `*Hurray, TEAM TRUST N RIDE! 🎉*\nAnother car successfully *tokenized!* 🚘✨ Let's keep up the pace and accelerate towards even bigger wins!\n*Car*: ${carTitle}\n*REG NO*:${carRegistrationNumber}\n*Model*:${carModel}\n*Deal Amount*: ${dealDoneAmount}\n*Token Amount*: ${tokenAmount}\n*Pay to*:${paymentTo}\n*Payment Mode*:${paymentMode}\n*Customer Name*:${customerName}\n*Customer Adress*:${customerAddress}\n*Payment of Remaining Amount By*:${loanOrCash}\n*Invoice attached.Let’s continue the momentum!*`
                const response = await uploadMediaAndSendMessagePurchaseDeal(phoneNumberId,messagingProduct,file,carTitle,customerName,challanAmount,dealDoneAmount,carRegistrationNumber,whatsappMobile);
        
                console.log('Media upload response:', response);
            } catch (error) {
                console.error('Error during request:', error);
            }
        }    
makeRequest();
        const message = `Dear ${customerName},🎉\n Congratulations on finding the best deal for your car with TRUST N RIDE! We are excited to inform you that your ${carTitle} (${carRegistrationNumber}) has been successfully sold. 🚀\n📑 Please review the attached PDF, which includes all payment details, held amount details, agreement, and terms & conditions.\n\nWe appreciate your trust in TRUST N RIDE and look forward to assisting you again in the future! 🚘💙\n\nBest Regards,\nTeam TRUST N RIDE`;
  
        // Send the reset link via email (only to the user's email, not mobile)
        await sendEmail({
          email: customerEmail, // Email from the database
          subject: '🚗 TICK TOCK SOLD!!, Your Car is Successfully Sold with TRUST N RIDE',
          message,
          attachmentPath: req.file.path, // Replace with actual file path
          attachmentName: "Purchase_Invoice_Agreement_T&C.pdf", // Optional, default is "document.pdf"
        });
    
    return res.status(201).json({
      message: 'Purchase Deal application submitted successfully!',
      purchasedeal,
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
exports.getPurchaseDealCount = async (req, res) => {
  try {
    // Count all documents in the Token collection
    const purchasedealCount = await PurchaseDeal.countDocuments();
    
    // Send the response with the count
    res.status(200).json({
      success: true,
      message: 'Purchase Deal count fetched successfully',
      count: purchasedealCount,
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



