const cloudinary = require("../utils/cloudinary2");
const NOC = require("../models/rtoprocess");
const sendEmail = require('../utils/sendEmail');
const {sendTextMessages} = require('../utils/whatsapp');
// Upload images to Cloudinary without compression
const uploadToCloudinary = async (file) => {
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // Automatically detect the type (image/video)
          quality: 70, // Automatically adjust quality
          fetch_format: "auto", // Automatically select format (e.g., JPEG, PNG, WebP)
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(file.buffer); // Pipe the buffer to Cloudinary's upload stream
    });

    return uploadResult.secure_url; // Return the Cloudinary image URL
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Error uploading image to Cloudinary");
  }
};

exports.createNOC = async (req, res) => {
  try {

   const  {customerPhoneNumber}=req.body;

    // Handle image uploads and upload each image directly to Cloudinary
    const formImages = req.files.form28
      ? await Promise.all(req.files.form28.map(file => uploadToCloudinary(file)))
      : [];
    const CarRc = req.files.CarRc
      ? await Promise.all(req.files.CarRc.map(file => uploadToCloudinary(file)))
      : [];
    const customerAadharCardImages = req.files.customerAadharCard
      ? await Promise.all(req.files.customerAadharCard.map(file => uploadToCloudinary(file)))
      : [];
    const blankPaperImages = req.files.blankPaperPhoto
      ? await Promise.all(req.files.blankPaperPhoto.map(file => uploadToCloudinary(file)))
      : [];
    const ownerAadharCardImages = req.files.ownerAadharCard
      ? await Promise.all(req.files.ownerAadharCard.map(file => uploadToCloudinary(file)))
      : [];
    const ownerPhoto = req.files.ownerPhoto
      ? await uploadToCloudinary(req.files.ownerPhoto[0])
      : null;
    const customerPhoto = req.files.customerPhoto
      ? await uploadToCloudinary(req.files.customerPhoto[0])
      : null;

    // Prepare the data for the NOC model
    const nocData = {
      ...req.body,
      form28: formImages,
      CarRc: CarRc,
      customerAadharCard: customerAadharCardImages,
      customerPhoto,
      ownerAadharCard: ownerAadharCardImages,
      ownerPhoto,
      blankPaperPhoto: blankPaperImages,
    };

    const noc = new NOC(nocData); // Create a new NOC document
    await noc.save();

    //send message  to whatsapp
    async function makeRequest() {
      try {
        const { carRegistrationNumber, CarTitle,ownerPhoneNumber,agentName,agentPhoneNumber,customerPhoneNumber,rtoName } = req.body;
        const ownermessage=`*This is a notification from Trust N Ride.*\nA new RTO document has been sent for dispatch. Please review the details.\n *Details are:-*\n *CAR TITLE*:${CarTitle}\n*Car Registration number*:${carRegistrationNumber}\n*owner phone number*:${ownerPhoneNumber}\n*Agent name*:${agentName}\n*Agent Phone number*:${agentPhoneNumber}\n *Customer Phone Number*:${customerPhoneNumber}\n*Rto Name*:${rtoName}\nTap the link below to view the document\nhttps://www.trustnride.in/viewnoc\nThank you for your attention! - Team Trust N Ride`
          const customermessage = `🚗 *Trust N Ride Update!*\n*Hi ${CarTitle} Owner,*\nYour car's transfer document is now dispatched! Be ready for the party peshi(Physical Verification) for the RC transfer of your ${CarTitle}.\n*Once completed, your holdback amount will be released.*\nStay tuned for the next steps!\n*- Team Trust N Ride.* ` 
          const agentmessage = `🚗 *Trust N Ride Update!*\n*Dear RTO Agent,*\nWe are sending the new car papers for the RTO process(transfer/noc) of the Car with registration number: *${carRegistrationNumber}.*\nWe highly encourage you to process the paperwork quickly—your fast action will directly benefit you, as it opens the door for more future work with us.\n*You will soon receive the tracking ID for the dispatched document. Kindly receive it through courier.*\n*- Team Trust N Ride* `
          const response = await sendTextMessages(ownerPhoneNumber,ownermessage,customermessage,agentmessage,agentPhoneNumber);
  
          console.log('Message  response:', response);
      } catch (error) {
          console.error('Error during request:', error);
      }
  }
  
  makeRequest(); 








    
    
    // Send email notification to admin
    

    res.status(201).json({
      success: true,
      message: "NOC created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Find NOC(s) by carRegistrationNumber
exports.getNOCByRegistrationNumber = async (req, res) => {
  try {
    const registrationNumberRegex = new RegExp(req.params.carRegistrationNumber, 'i');
    const nocs = await NOC.find({ carRegistrationNumber: { $regex: registrationNumberRegex } });

    if (nocs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No NOC found for the given registration number",
      });
    }

    res.status(200).json({
      success: true,
      nocs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Fetch all NOC documents
exports.getAllNOCs = async (req, res) => {
 
    const nocs = await NOC.find(); // Fetch all NOC documents
   
    try {
    res.status(200).json({
      success: true,
      nocs,
    });

    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
