const mongoose = require('mongoose');

// Define the schema for the purchase token
const purchaseTokenSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  ownerWhatsApp: { type: String, required: true },
  carTitle: { type: String, required: true },
  carRegistrationNumber: { type: String, required: true },
  tokenAmount: { type: Number, required: true },
  approxDealAmount: { type: Number, required: true },
  carModel: { type: String, required: true },

  // Add customer address as a single string
  address: { type: String, required: true },
}, { timestamps: true });

// Create the model
const PurchaseToken = mongoose.model('PurchaseToken', purchaseTokenSchema);

module.exports = PurchaseToken;
