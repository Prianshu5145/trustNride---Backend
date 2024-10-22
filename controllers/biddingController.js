const biddingListing = require('../models/biddingListing');
const nodemailer = require('nodemailer');
const WebSocket = require('ws');
const cloudinary = require('../utils/cloudinary');
const sendEmail = require('../utils/sendEmail');
const moment = require('moment-timezone');
// Setup WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Broadcast function to send updates to all clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Create a new bidding (by an approved seller)
exports.createBidding = async (req, res) => {
    const { vehicleModel, year, title, description, images, thresholdAmount, startTime, duration } = req.body;
    const userId = req.user.id;
  
    try {
     
  
      const imageUploads = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUploads.push(result.secure_url);
      }
  
      const listing = new biddingListing({
        seller: userId,
        vehicleModel,
        year,
        title,
        description,
        images: imageUploads,
        thresholdAmount,
        currentMaxBid: thresholdAmount,
        startTime, // New field
        duration,  // New field
      });
  
      await listing.save();
      res.status(201).json({ message: 'Bidding created successfully', listing });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  // to fetch all bidding listings
  

// Function to convert UTC time to IST


// Function to convert UTC time to IST
const convertToIST = (utcDate) => {
  const options = { timeZone: 'Asia/Kolkata', hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const istDateString = new Date(utcDate).toLocaleString('en-US', options); // Convert to IST string
  return new Date(istDateString); // Convert back to Date object
};

// Controller to fetch all bidding listings
exports.getAllBiddingListings = async (req, res) => {
  try {
    // Fetch all bidding listings from the database
    const listings = await biddingListing.find();

    // Convert the startTime and calculate endTime for each listing to IST
    const listingsWithISTTime = listings.map(listing => {
      const startTimeIST = convertToIST(listing.startTime);
      const durationInMillis = listing.duration * 60 * 60 * 1000; // Convert duration to milliseconds
      const endTimeIST = new Date(startTimeIST.getTime() + durationInMillis); // Calculate end time in IST

      return {
        ...listing.toObject(), // Convert Mongoose object to plain JS object
        startTimeIST: startTimeIST, // Convert startTime to IST
        biddingEndTimeIST: endTimeIST, // Calculate and convert end time to IST
      };
    });

    // Return the listings with the IST times
    res.status(200).json({
      message: 'All bidding listings fetched successfully',
      listings: listingsWithISTTime,
    });
  } catch (error) {
    console.error('Error fetching bidding listings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//controller to fetch bidding listings by id
exports.getBiddingListingById = async (req, res) => {
    const { id } = req.params; // Extract ID from request parameters
  
    try {
      // Find the bidding listing by ID
      const listing = await biddingListing.findById(id);
  
      // Check if the listing exists
      if (!listing) {
        return res.status(404).json({ message: 'Bidding listing not found' });
      }
  
      // Convert start time to IST and calculate end time
      const startTimeIST = convertToIST(listing.startTime);
      const durationInMillis = listing.duration * 60 * 60 * 1000; // Convert duration to milliseconds
      const endTimeIST = new Date(startTimeIST.getTime() + durationInMillis); // Calculate end time in IST
  
      // Prepare response with IST times
      const response = {
        ...listing.toObject(), // Convert Mongoose object to plain JS object
        startTimeIST: startTimeIST, // Convert startTime to IST
        biddingEndTimeIST: endTimeIST, // Calculate and convert end time to IST
      };
  
      // Return the listing with IST times
      res.status(200).json({
        message: 'Bidding listing fetched successfully',
        listing: response,
      });
    } catch (error) {
      console.error('Error fetching bidding listing:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };




// Place a bid (for registered users)
exports.placeBid = async (req, res) => {
    const { bidAmount } = req.body;
    const listingId = req.params.listingId;
    const userId = req.user.id;
  
    try {
      const listing = await biddingListing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
  
      const biddingStartTime = moment.tz(listing.startTime, 'Asia/Kolkata');
    const currentTime = moment.tz('Asia/Kolkata'); // Current time in IST
    const biddingEndTime = biddingStartTime.clone().add(listing.duration, 'hours');

    if (currentTime.isBefore(biddingStartTime)) {
      return res.status(400).json({ message: 'Bidding has not started yet' });
    }

    if (currentTime.isAfter(biddingEndTime)) {
      return res.status(400).json({ message: 'Bidding is over' });
    }
      
  
      const existingBid = listing.bids.find(bid => bid.user.toString() === userId);
      if (existingBid) {
        existingBid.maxBid = bidAmount;
      } else {
        listing.bids.push({ user: userId, maxBid: bidAmount });
      }
  
      listing.currentMaxBid = bidAmount;
      await listing.save();
  
      broadcast({ listingId: listing._id, currentMaxBid: listing.currentMaxBid });
  
      const message = `Thanks for placing bid, you are now the highest bidder with ₹${bidAmount}`;
      await sendEmail({
        email: req.user.email,
        subject: 'Bidding Update',
        message,
      });
  
      res.status(200).json({ message: 'Bid placed successfully', currentMaxBid: listing.currentMaxBid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

