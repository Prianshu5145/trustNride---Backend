const mongoose = require("mongoose");

const nocSchema = new mongoose.Schema({
  Form: {
    type: [String],
    required: true,
  },
  customerAadharCard: {
    type: [String],
    required: true,
  },
  customerPhoto: {
    type: String,
    required: true,
  },
  ownerAadharCard: {
    type: [String],
    required: true, // URL or path to uploaded owner's Aadhar card
  },
  ownerPhoto: {
    type: String,
    required: true, // URL or path to uploaded owner's photo
  },
  blankPaperPhoto: {
    type: [String],
    required: true, // URL or path to uploaded blank paper photo
  },
  agentName: {
    type: String,
    required: true,
  },
  rtoName: {
    type: String,
    required: true,
  },
  agentPhoneNumber: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/, // Validate Indian phone numbers
  },
  carRegistrationNumber: {
    type: String,
    required: true,
  },
  customerPhoneNumber: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/, // Validate Indian phone numbers
  },
  status: {
    type: String,
    default: 'pending', // Status defaults to 'pending' when not provided
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NOC = mongoose.model("NOC", nocSchema);

module.exports = NOC;