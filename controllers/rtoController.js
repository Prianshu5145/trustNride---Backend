const cloudinary = require("../utils/cloudinary2");
const NOC = require("../models/rtoprocess");
const sendEmail = require('../utils/sendEmail');
const {sendMessage} = require('../utils/whatsapp');
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

    const { carRegistrationNumber, CarTitle } = req.body;
    const subject = "New RTO Document is Ready to send";
    const message = `New document of Car is ready to send with:\n\n Registration no: ${carRegistrationNumber}\nCar Title: ${CarTitle}\nPlease visit the link to see details of the document.`;

    // Send email notification to admin
    await sendEmail({
      email: "trustnride51@gmail.com", // Admin email
      subject: subject,
      message: message,
    });

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
   const h =  sendMessage('919119913441', {
    images: [
      'https://res.cloudinary.com/dztz5ltuq/image/upload/v1730357516/1729629559236_2_2_kdv48o.jpg',
      
    ]
  });
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
