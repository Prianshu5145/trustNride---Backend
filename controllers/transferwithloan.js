const cloudinary = require("../utils/cloudinary2");

const TRANSFERWITHLOAN = require("../models/rtotransferwithloan");
const sendEmail = require('../utils/sendEmail');
const uploadToCloudinary = async (file) => {
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // Automatically detect the type (image/video)
          quality: 60, // Automatically adjust quality
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





exports.createTRANSFERWITHLOAN = async (req, res) => {
   
    try {
      
      // Handle image uploads and compress each image before uploading to Cloudinary
      const formImages28 = req.files.form28 ? await Promise.all(req.files.form28.map(file => uploadToCloudinary(file))) : [];
      
      const formImages29 = req.files.form29 ? await Promise.all(req.files.form29.map(file => uploadToCloudinary(file))) : [];
      const formImages30 = req.files.form30 ? await Promise.all(req.files.form30.map(file => uploadToCloudinary(file))) : [];
      const formImages34 = req.files.form34 ? await Promise.all(req.files.form34.map(file => uploadToCloudinary(file))) : [];
      const noc1 = req.files.noc ? await Promise.all(req.files.noc.map(file => uploadToCloudinary(file))) : [];
      const CarRc = req.files.CarRc ? await Promise.all(req.files.CarRc.map(file => uploadToCloudinary(file))) : [];
      const customerAadharCardImages = req.files.customerAadharCard ? await Promise.all(req.files.customerAadharCard.map(file => uploadToCloudinary(file))) : [];
      const blankPaperImages = req.files.blankPaperPhoto ? await Promise.all(req.files.blankPaperPhoto.map(file => uploadToCloudinary(file))) : [];
      const ownerAadharCardImages = req.files.ownerAadharCard ? await Promise.all(req.files.ownerAadharCard.map(file => uploadToCloudinary(file))) : [];
      const ownerPhoto = req.files.ownerPhoto ? await uploadToCloudinary(req.files.ownerPhoto[0]) : null;
      const customerPhoto = req.files.customerPhoto ? await uploadToCloudinary(req.files.customerPhoto[0]) : null;
  
      // Prepare the data for the NOC model
      const TRANSFERWITHLOANDATA = {
        ...req.body,
        form28: formImages28, 
        form29: formImages29, 
        form30: formImages30, 
        form34: formImages34, 
        noc : noc1,
        CarRc:CarRc,

        customerAadharCard: customerAadharCardImages,
        customerPhoto,
        ownerAadharCard: ownerAadharCardImages,
        ownerPhoto,
        blankPaperPhoto: blankPaperImages,
      };
  
      const tRANSFERWITHLOAN = new TRANSFERWITHLOAN(TRANSFERWITHLOANDATA); // Create a new NOC document
      await tRANSFERWITHLOAN.save();
      const {carRegistrationNumber ,CarTitle } = req.body;
      const subject = 'New RTO Document is Ready to send ';
      const message = `New document of Car is ready to send with :\n\n Registration no: ${carRegistrationNumber}\nCar Title: ${CarTitle}\n     please visit link this to see details of document`;

      // Send email notification to admin
        await sendEmail({
          email: "trustnride51@gmail.com", // Admin email
          subject: subject,
          message: message,
      }); 
      
      
      res.status(201).json({
        success: true,
        message: "DOCUMENT FOR TRANSFER WITH HYPO created successfully",
        
      });
     


    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  
  

// Find NOC(s) by carRegistrationNumber
exports.getTRANSFERWITHLOANByRegistrationNumber = async (req, res) => {
  try {
    const registrationNumberRegex = new RegExp(req.params.carRegistrationNumber, 'i');
    const nocs = await TRANSFERWITHLOAN.find({ carRegistrationNumber: { $regex: registrationNumberRegex } });

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
exports.getAllgetTRANSFERWITHLOAN = async (req, res) => {
  try {
    const nocs = await TRANSFERWITHLOAN.find(); // Fetch all NOC documents
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
