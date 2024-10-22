const mongoose = require('mongoose');

// Define the Bid schema
const BidSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  maxBid: { type: Number, required: true },
});

// Define the Listing schema
const ListingSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleModel: { type: String, required: true },
  year: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  thresholdAmount: { type: Number, required: true },
  currentMaxBid: { type: Number, default: 0 }, // Initially set to 0 or thresholdAmount
  bids: [BidSchema], // Array of bids, each with user and their maxBid
  startTime: { type: Date, required: true }, // Bidding start time
  duration: { type: Number, required: true }, // Bidding duration in hours
}, { timestamps: true });

module.exports = mongoose.model('biddingListing', ListingSchema);
