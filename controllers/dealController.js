const Deal = require('../models/deal');
const {dealmessageandinvoice} = require('../utils/whatsappdeal');
const fs = require('fs');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();
// Create a new deal
exports.createDeal = async (req, res) => {
    try {
        const {
            totalAmountGotTillNowExcludingToken,
            amountPaidToSatish,
            amountPaidToSatishBy,
            amountPaidToPiyush,
            amountPaidToCompanyAccount,
            amountPaidToPiyushBy,
            amountPaidToOmprakash,
            amountPaidToOmprakashBy,
            CustomerPaymentMode,
            tokenAmount,
            tokenAmountPaidTo,
            dealAmount,
            anyFinalDiscountFromDealAmount,
            holdFromCustomer,
            amountComeFromLoan,
            totalAmountGotFromCustomerTillNowIncludingToken,
            carTitle,
            carRegistrationNumber,
            customerWhatsappNumber,
            customerMobileNumber,
            customerName,
            customerEmail,
            customerAddress,
        } = req.body;

        const newDeal = new Deal({
            totalAmountGotTillNowExcludingToken,
            amountPaidToSatish,
            amountPaidToSatishBy,
            amountPaidToPiyush,
            amountPaidToCompanyAccount,
            amountPaidToPiyushBy,
            amountPaidToOmprakash,
            amountPaidToOmprakashBy,
            CustomerPaymentMode,
            tokenAmount,
            tokenAmountPaidTo,
            dealAmount,
            anyFinalDiscountFromDealAmount,
            holdFromCustomer,
            amountComeFromLoan,
            totalAmountGotFromCustomerTillNowIncludingToken,
            carTitle,
            carRegistrationNumber,
            customerWhatsappNumber,
            customerMobileNumber,
            customerEmail,
            customerName,
            customerAddress,
        });

        await newDeal.save();
        async function makeRequest() {
            try {
    
                const phoneNumberId = process.env.phoneNumberId; // Replace with your actual phone number ID
                const messagingProduct = 'whatsapp'; // Replace with your actual messaging product
                const file = fs.createReadStream(req.file.path); // Replace with the path to your file
        
            // const CustomerMessage1  =    `*Congratulations from TRUST N RIDE!* 🎉\nWe’re excited to welcome you to the TRUST N RIDE family! Congratulations on tokening your dream car ✨🚘—it’s now yours! *We’re thrilled to be part of your journey, and we’re sure this car will bring you countless memories and adventures.*`
             // const CustomerMessage2 =  `Here are the details of your car:\n*Car*: ${carTitle}\n*Model*:${carModel}\n*Deal Amount*: ${dealDoneAmount}+Rto Charges\n*Token Amount*: ${tokenAmount}\n*Fair Market Value*: *${fairMarketValue}*\n*Your token invoice is attached below for your reference.*\nThank you again for choosing TRUST N RIDE. If you need any further assistance, don’t hesitate to reach out!`    
             //  const ownerMessage = `*Hurray, TEAM TRUST N RIDE! 🎉*\nAnother car successfully *tokenized!* 🚘✨ Let's keep up the pace and accelerate towards even bigger wins!\n*Car*: ${carTitle}\n*REG NO*:${carRegistrationNumber}\n*Model*:${carModel}\n*Deal Amount*: ${dealDoneAmount}\n*Token Amount*: ${tokenAmount}\n*Pay to*:${paymentTo}\n*Payment Mode*:${paymentMode}\n*Customer Name*:${customerName}\n*Customer Adress*:${customerAddress}\n*Payment of Remaining Amount By*:${loanOrCash}\n*Invoice attached.Let’s continue the momentum!*`
                const response = await dealmessageandinvoice(phoneNumberId, messagingProduct,file,totalAmountGotTillNowExcludingToken,
                    amountPaidToSatish,
                    amountPaidToSatishBy,
                    amountPaidToPiyush,
                    amountPaidToCompanyAccount,
                    amountPaidToPiyushBy,
                    amountPaidToOmprakash,
                    amountPaidToOmprakashBy,
                    CustomerPaymentMode,
                    tokenAmount,
                    tokenAmountPaidTo,
                    dealAmount,
                    anyFinalDiscountFromDealAmount,
                    holdFromCustomer,
                    amountComeFromLoan,
                    totalAmountGotFromCustomerTillNowIncludingToken,
                    carTitle,
                    carRegistrationNumber,
                    customerWhatsappNumber,
                    customerMobileNumber,
                    customerName,
                    customerAddress
                  );
        
                console.log('Media upload response:', response);
            } catch (error) {
                console.error('Error during request:', error);
            }
        }
        
        makeRequest();

        
            const message = `
  <strong>Dear ${customerName},</strong>
  <p>Great news! Your ${carTitle} (${carRegistrationNumber}) is ready for delivery. 🚗✨ We are thrilled to inform you that the payment at delivery has been successfully completed.</p>
  <p>📑 Please find the attached PDF, which includes all payment details, delivery confirmation, and Agreement. Kindly review it before taking delivery.</p>
  <p>We truly appreciate your trust in TRUST N RIDE and are excited to hand over your vehicle to you. If you have any questions or need assistance, feel free to reach out to us! 🚘💙</p>
  <strong>Best Regards,</strong>
  <br>
  <strong>Team TRUST N RIDE</strong>
`;

      
        
              // Send the reset link via email (only to the user's email, not mobile)
              await sendEmail({
                email: customerEmail, // Email from the database
                subject: `The Wait is Over! ${carTitle} Ready for Delivery 🚗💨`,
                message,
                attachmentPath: req.file.path, // Replace with actual file path
                attachmentName: "Payment_Details_Agreement.pdf", // Optional, default is "document.pdf"
              });
        

        res.status(201).json({ message: 'Deal created successfully!', newDeal });
    } catch (error) {
        res.status(500).json({ error: 'Error creating deal', message: error.message });
    }
};

// Get all deals
exports.getAllDeals = async (req, res) => {
    try {
        const deals = await Deal.find();
        res.status(200).json(deals);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching deals', message: error.message });
    }
};

// Get a single deal by ID
exports.getDealById = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ error: 'Deal not found' });
        }
        res.status(200).json(deal);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching deal', message: error.message });
    }
};

// Update a deal by ID
exports.updateDeal = async (req, res) => {
    try {
        const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!deal) {
            return res.status(404).json({ error: 'Deal not found' });
        }
        res.status(200).json({ message: 'Deal updated successfully', deal });
    } catch (error) {
        res.status(500).json({ error: 'Error updating deal', message: error.message });
    }
};

// Delete a deal by ID
exports.deleteDeal = async (req, res) => {
    try {
        const deal = await Deal.findByIdAndDelete(req.params.id);
        if (!deal) {
            return res.status(404).json({ error: 'Deal not found' });
        }
        res.status(200).json({ message: 'Deal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting deal', message: error.message });
    }
};
 // get deal count

 exports.getdealCount = async (req, res) => {
    try {
      // Count all documents in the Token collection
      const dealCount = await Deal.countDocuments();
      
      // Send the response with the count
      res.status(200).json({
        success: true,
        message: 'Deal count fetched successfully',
        count: dealCount,
      });
    } catch (error) {
      console.error('Error fetching Deal count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch Deal count',
        error: error.message,
      });
    }
  };