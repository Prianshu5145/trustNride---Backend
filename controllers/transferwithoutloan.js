const cloudinary = require("../utils/cloudinary2");
const sharp = require("sharp");
const TRANSFERWITHOUTLOAN = require("../models/rtotransferwithoutloan");
const sendEmail = require('../utils/sendEmail');
const compressAndUploadToCloudinary = async (file) => {
  try {
    // Compress the image using sharp
    const compressedBuffer = await sharp(file.buffer)
      .jpeg({ quality: 50 }) // Adjust quality for compression
      .toBuffer();

    // Use Cloudinary's upload_stream method for uploading buffer directly
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // Automatically detect the type (image/video)
          quality: "auto", // Automatically adjust quality
          fetch_format: "auto", // Automatically select format (e.g., JPEG, PNG, WebP)
        },
        (error, result) => {
          if (error) {
            reject(error); // Reject the promise if there's an error
          } else {
            resolve(result); // Resolve the promise with the result
          }
        }
      );

      // Pipe the buffer to Cloudinary's upload stream
      stream.end(compressedBuffer);
    });

    return uploadResult.secure_url; // Return the Cloudinary image URL
  } catch (error) {
    console.error("Error compressing or uploading image:", error);
    throw new Error("Error compressing or uploading image");
  }
};





exports.createTRANSFERWITHOUTLOAN = async (req, res) => {
   
    try {
      
      // Handle image uploads and compress each image before uploading to Cloudinary
      const formImages28 = req.files.form28 ? await Promise.all(req.files.form28.map(file => compressAndUploadToCloudinary(file))) : [];
      
      const formImages29 = req.files.form29 ? await Promise.all(req.files.form29.map(file => compressAndUploadToCloudinary(file))) : [];
      const formImages30 = req.files.form30 ? await Promise.all(req.files.form30.map(file => compressAndUploadToCloudinary(file))) : [];
      const noc1 = req.files.noc ? await Promise.all(req.files.noc.map(file => compressAndUploadToCloudinary(file))) : [];
      const CarRc = req.files.CarRc ? await Promise.all(req.files.CarRc.map(file => compressAndUploadToCloudinary(file))) : [];
      const customerAadharCardImages = req.files.customerAadharCard ? await Promise.all(req.files.customerAadharCard.map(file => compressAndUploadToCloudinary(file))) : [];
      const blankPaperImages = req.files.blankPaperPhoto ? await Promise.all(req.files.blankPaperPhoto.map(file => compressAndUploadToCloudinary(file))) : [];
      const ownerAadharCardImages = req.files.ownerAadharCard ? await Promise.all(req.files.ownerAadharCard.map(file => compressAndUploadToCloudinary(file))) : [];
      const ownerPhoto = req.files.ownerPhoto ? await compressAndUploadToCloudinary(req.files.ownerPhoto[0]) : null;
      const customerPhoto = req.files.customerPhoto ? await compressAndUploadToCloudinary(req.files.customerPhoto[0]) : null;
  
      // Prepare the data for the NOC model
      const TRANSFERWITHOUTLOANDATA = {
        ...req.body,
        form28: formImages28, 
        form29: formImages29, 
        form30: formImages30, 
        noc : noc1,
        CarRc:CarRc,
        customerAadharCard: customerAadharCardImages,
        customerPhoto,
        ownerAadharCard: ownerAadharCardImages,
        ownerPhoto,
        blankPaperPhoto: blankPaperImages,
      };
  
      const tRANSFERWITHOUTLOAN = new TRANSFERWITHOUTLOAN(TRANSFERWITHOUTLOANDATA); // Create a new NOC document
      await tRANSFERWITHOUTLOAN.save();
      const {carRegistrationNumber ,CarTitle } = req.body;
      const subject = 'New RTO Document is Ready to Dispatch ';
      const message = `New document of Car is ready to Dispatch with :\n\n Registration no: ${carRegistrationNumber}\nCar Title: ${CarTitle}\n     please visit link this to see details of document`;

      // Send email notification to admin
        await sendEmail({
          email: "trustnride51@gmail.com", // Admin email
          subject: subject,
          message: message,
      }); 
      
      
      res.status(201).json({
        success: true,
        message: "DOCUMENT FOR TRANSFER WITHOUT HYPO created successfully",
        
      });
     


    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  
  

// Find NOC(s) by carRegistrationNumber
exports.getTRANSFERWITHOUTLOANByRegistrationNumber = async (req, res) => {
  try {
    const registrationNumberRegex = new RegExp(req.params.carRegistrationNumber, 'i');
    const nocs = await TRANSFERWITHOUTLOAN.find({ carRegistrationNumber: { $regex: registrationNumberRegex } });

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
exports.getAllgetTRANSFERWITHOUTLOAN = async (req, res) => {
  try {
    const nocs = await TRANSFERWITHOUTLOAN.find(); // Fetch all NOC documents
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
