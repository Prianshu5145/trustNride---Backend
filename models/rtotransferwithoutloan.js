const mongoose = require("mongoose");

const TRANSFERWITHOUTLOANSchema = new mongoose.Schema({
    form28: {
      type: [String],
      required: true,
    },
    form29: {
      type: [String],
      required: true,
    },
    form30: {
      type: [String],
      required: true,
    },
    noc: {
  type: [String],
  default: [] // Default is an empty array if no value is provided
},
CarRc: {
      type: [String],
      required: true,// Default is an empty array if no value is provided
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
  default: [] // URL or path to uploaded blank paper photo
    },
    CarTitle: {
      type: String,
      required: true,
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
      match: /^[6-9]\d{9}$/, 
    },
    ownerPhoneNumber: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/, // Validate Indian phone numbers
  },
    status: {
      type: String,
      default: 'pending', 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const TRANSFERWITHOUTLOAN = mongoose.model("TRANSFERWITHOUTLOAN",TRANSFERWITHOUTLOANSchema );
  
  module.exports = TRANSFERWITHOUTLOAN;