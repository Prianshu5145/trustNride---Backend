const mongoose = require('mongoose');

// Helper to return current IST time
function getISTDate() {
  const currentUTC = new Date();
  return new Date(currentUTC.getTime() + 330 * 60000); // IST = UTC + 5:30
}

// Define the schema for the purchase token
const purchaseTokenSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  ownerWhatsApp: { type: String, required: true },
  carTitle: { type: String, required: true },
  carRegistrationNumber: { type: String, required: true },
  tokenAmount: { type: Number, required: true },
  approxDealAmount: { type: Number, required: true },
  carModel: { type: String, required: true },
  address: { type: String, required: true },

  // Override default timestamps with IST
  createdAt: { type: Date, default: getISTDate },
  updatedAt: { type: Date, default: getISTDate },
});
  
// Create the model
const PurchaseToken = mongoose.model('PurchaseToken', purchaseTokenSchema);

module.exports = PurchaseToken;
