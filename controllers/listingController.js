const Listing = require('../models/Listing');
const cloudinary = require('../utils/cloudinary');
const sharp = require('sharp'); // For image compression
const ffmpeg = require('fluent-ffmpeg'); // For video compression
const ffmpegPath = require('ffmpeg-static'); // Path to the FFmpeg binary
const path = require('path');
const Product = require('../models/assgn');
// Set the path for FFmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Your controller code continues here...

// Create a new listing (only approved sellers can create listings)
exports.createListing = async (req, res) => {
  console.log("Files:", req.files);  // Log the files
  console.log("Body:", req.body);
  const { title, description, price, FairMarketValue, KM, overview, inspectionReport, InspectionReportVideoLink } = req.body;

  // Check if 'images' field exists in req.files
  if (!req.files || !req.files.images) {
    return res.status(400).json({ message: 'No images uploaded' });
  }

  try {
    // Function to upload a single image or video to Cloudinary
    const uploadToCloudinary = async (filePath, resourceType = "image") => {
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: resourceType, // Specify the resource type (image or video)
        });
        return result.secure_url; // Return the URL of the uploaded file
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload to Cloudinary");
      }
    };

    // Function to compress an image
    const compressImage = async (filePath) => {
      const outputPath = `${filePath}-compressed.jpg`;
      await sharp(filePath)
        .resize(800) // Resize to a width of 800px, maintain aspect ratio
        .jpeg({ quality: 20


         }) // Compress to 70% quality
        .toFile(outputPath);
      return outputPath;
    };

    // Function to compress a video
    const compressVideo = (filePath) => {
      const outputPath = path.join('uploads', `${Date.now()}-compressed.mp4`);
      return new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .output(outputPath)
          .videoCodec('libx264')
          .size('640x?') // Resize to a width of 640px
          .on('end', () => resolve(outputPath))
          .on('error', reject)
          .run();
      });
    };

    // Upload general listing images
    const imageUploads = await Promise.all(
      req.files.images.map(async (file) => {
        const compressedImagePath = await compressImage(file.path);
        return uploadToCloudinary(compressedImagePath);
      })
    );

    // Upload inspection report images and videos (checking for existence)
    const lhsTyreImage = req.files['inspectionReport[exterior][lhsTyre][image]'] ?
      await uploadToCloudinary(await compressImage(req.files['inspectionReport[exterior][lhsTyre][image]'][0].path)) : null;
      
    const rhsTyreImage = req.files['inspectionReport[exterior][rhsTyre][image]'] ?
      await uploadToCloudinary(await compressImage(req.files['inspectionReport[exterior][rhsTyre][image]'][0].path)) : null;

    const lhsRearTyreImage = req.files['inspectionReport[exterior][lhsRearTyre][image]'] ?
      await uploadToCloudinary(await compressImage(req.files['inspectionReport[exterior][lhsRearTyre][image]'][0].path)) : null;

    const rhsRearTyreImage = req.files['inspectionReport[exterior][rhsRearTyre][image]'] ?
      await uploadToCloudinary(await compressImage(req.files['inspectionReport[exterior][rhsRearTyre][image]'][0].path)) : null;

    const spareTyreImage = req.files['inspectionReport[exterior][spareTyre][image]'] ?
      await uploadToCloudinary(await compressImage(req.files['inspectionReport[exterior][spareTyre][image]'][0].path)) : null;

    const videoPath = req.files['inspectionReport[engine][video]'] ? req.files['inspectionReport[engine][video]'][0].path : null;
    const engineVideo = videoPath ? await uploadToCloudinary(await compressVideo(videoPath), "video") : null;

    // Create the listing with full details including overview and inspection report
   
    // Create the listing with full details including overview and inspection report
    const listing = await Listing.create({
      title,
      description,
      price,
      images: imageUploads, // Store the uploaded image URLs
     // Seller ID from the token
     FairMarketValue,
     KM,
      overview: {
        registrationYear: overview.registrationYear,
        insurance: overview.insurance,
        fuelType: overview.fuelType,
        seats: overview.seats,
        kmsDriven: overview.kmsDriven,
        rto: overview.rto,
        ownership: overview.ownership,
        transmission: overview.transmission,
        yearOfManufacture: overview.yearOfManufacture,
        mileage: overview.mileage
      },
      inspectionReport: {
        carDocuments: {
          rcAvailability: inspectionReport.carDocuments.rcAvailability,
         
          mismatchInRC: inspectionReport.carDocuments.mismatchInRC,
          rtoNOCIssued: inspectionReport.carDocuments.rtoNOCIssued,
          insuranceType: inspectionReport.carDocuments.insuranceType,
          noClaimBonus: inspectionReport.carDocuments.noClaimBonus
        },
        
        exterior: {
          lhsTyre: {
            image: lhsTyreImage, // Store the uploaded image URL
            condition: inspectionReport.exterior.lhsTyre.condition
          },
          rhsTyre: {
            image: rhsTyreImage, // Store the uploaded image URL
            condition: inspectionReport.exterior.rhsTyre.condition
          },
          lhsRearTyre: {
            image: lhsRearTyreImage, // Store the uploaded image URL
            condition: inspectionReport.exterior.lhsRearTyre.condition
          },
          rhsRearTyre: {
            image: rhsRearTyreImage, // Store the uploaded image URL
            condition: inspectionReport.exterior.rhsRearTyre.condition
          },
          spareTyre: {
            image: spareTyreImage // Store the uploaded spare part image URL
          }
        },
        engine: {
          majorSound: inspectionReport.engine.majorSound,
          blowBy: inspectionReport.engine.blowBy,
          backCompression: inspectionReport.engine.backCompression,
          engineMounting: inspectionReport.engine.engineMounting,
          video: engineVideo // Store the uploaded video URL
        },
        ac: {
          acWorking: inspectionReport.ac.acWorking,
          heaterWorking: inspectionReport.ac.heaterWorking
        },
        electrical: {
          powerWindows: inspectionReport.electrical.powerWindows,
          airbagFeature: inspectionReport.electrical.airbagFeature,
          musicSystem: inspectionReport.electrical.musicSystem,
          parkingSensor: inspectionReport.electrical.parkingSensor,
          centralLock: inspectionReport.electrical.centralLock
        },
        steering: {
          steeringCondition: inspectionReport.steering.steeringCondition,
          brakeCondition: inspectionReport.steering.brakeCondition,
          suspensionCondition: inspectionReport.steering.suspensionCondition
        }
      },
      InspectionReportVideoLink,
    });

    res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (error) {
    console.error("Error creating listing:", error); // Log error for debugging
    res.status(500).json({ message: 'Error creating listing', error });
  }
};
//
exports.getAllListings = async (req, res) => {
  try {
      // Fetch all listings with specific fields, including nested fields from overview
      const listings = await Listing.find().select(
        'title description price images FairMarketValue KM overview.rto overview.kmsDriven overview.fuelType '
      );
      
      res.status(200).json(listings);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching listings', error });
  }
};
exports.AllListings = async (req, res) => {
  try {
      // Fetch 15 listings with specific fields, including nested fields from overview
      const listings = await Listing.find()
        .select('title price images FairMarketValue overview.rto overview.kmsDriven overview.fuelType')
        .limit(15); // Limit the number of documents to 15
      
      res.status(200).json(listings);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching listings', error });
  }
};

exports.getallassgnlisting = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product listings.',
    });
  }
};
exports.getassgnListingById = async (req, res) => {
  const { id } = req.params; // Extract ID from request parameters

  try {
      const listing = await Product.findById(id); // Find the listing by ID
      if (!listing) {
          return res.status(404).json({ message: 'Listing not found' });
      }
      res.status(200).json(listing); // Send the listing data as a response
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' }); // Handle server errors
  }
};

exports.getListingById = async (req, res) => {
  const { id } = req.params; // Extract ID from request parameters

  try {
      const listing = await Listing.findById(id); // Find the listing by ID
      if (!listing) {
          return res.status(404).json({ message: 'Listing not found' });
      }
      res.status(200).json(listing); // Send the listing data as a response
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' }); // Handle server errors
  }
};

// Get seller's own listings
exports.getSellerListings = async (req, res) => {
    
  const seller = req.user.id; // Get thconst {id} = req.params;e seller's ID from the token

  try {
    const listings = await Listing.find({ seller }).populate('seller', 'name email');
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your listings', error });
  }
};

// Update a listing (admins can update any listing, sellers can update their own)
exports.updateListing = async (req, res) => {
  
  const seller = req.user.id; // Get the seller's ID from the token
  const isAdmin = req.user.role === 'admin'; // Check if the user is an admin
  const { id } = req.params;
console.log(seller);
  try {
    // If the user is an admin, allow them to update any listing
    const query = isAdmin ? { _id: id } : { _id: id, seller }; // Admin can update any listing
console.log("query",query);
    const listing = await Listing.findOneAndUpdate(
      query, // Ensure the seller can only update their own listing
      { ...req.body, updatedAt: Date.now() }, // Update the listing details
      { new: true, runValidators: true } // Return the updated listing
    );
console.log("listing",listing);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found or you are not authorized' });
    }

    res.status(200).json({ message: 'Listing updated successfully', listing });
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing', error });
  }
};

// Delete a listing (admins can delete any listing, sellers can delete their own)
exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const seller = req.user.id; // Get the seller's ID from the token
  const isAdmin = req.user.role === 'admin'; // Check if the user is an admin

  try {
    // If the user is an admin, allow them to delete any listing
    const query = isAdmin ? { _id: id } : { _id: id, seller }; // Admin can delete any listing

    const listing = await Listing.findOneAndDelete(query);
console.log("listings",listing);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found or you are not authorized' });
    }

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error });
  }
};
