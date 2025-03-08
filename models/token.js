// models/Token.js
const mongoose = require('mongoose');

// Define the schema for the token data
const tokenSchema = new mongoose.Schema({
  carTitle: {
    type: String,
    required: true,
  },
  carModel: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerMobile: {
    type: String,
    required: true,
  },
  whatsappMobile: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: false,
  },
  tokenAmount: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
    enum: ['Cash', 'Personal Account', 'Company Account'],
  },
  paymentTo: {
    type: String,
    required: true,
    enum: ['Piyush', 'Ramesh', 'Omprakash'],
  },
  dealDoneAmount: {
    type: Number,
    required: true,
  },
  fairMarketValue: {
    type: Number,
    required: true,
  },
  carRegistrationNumber: {
    type: String,
    required: true,
  },
  
  loanOrCash: {
    type: String,
    required: true,
    enum: ['Loan', 'Cash'],
  },
  dateOfPaymentReceived: {
    type: Date,
    required: true,
    default: Date.now, // Sets the current date as default
  },
});

// Create a Token model based on the schema
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
