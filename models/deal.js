const mongoose = require('mongoose');

// IST offset in minutes = 5 hours 30 minutes = 330 minutes
function getISTDate() {
  const currentUTC = new Date();
  const istTime = new Date(currentUTC.getTime() + 330 * 60000); // 60000 ms = 1 min
  return istTime;
}

const dealSchema = new mongoose.Schema({
  totalAmountGotTillNowExcludingToken: { type: Number, required: true },
  amountPaidToSatish: { type: Number, required: true },
  amountPaidToSatishBy: {
    type: String,
    enum: ['cash', 'inpersonalaccount', 'inpersonalaccount+cash', 'Does not Know','not applicable'],
    required: true,
  },
  amountPaidToPiyush: { type: Number, required: true },
  amountPaidToCompanyAccount: { type: Number, required: true },
  amountPaidToPiyushBy: {
    type: String,
    enum: ['cash', 'inpersonalaccount', 'inpersonalaccount+cash', 'Does not Know','not applicable'],
    required: true,
  },
  amountPaidToOmprakash: { type: Number, required: true },
  amountPaidToOmprakashBy: {
    type: String,
    enum: ['cash', 'inpersonalaccount', 'inpersonalaccount+cash','Does not Know', 'not applicable'],
    required: true,
  },
  CustomerPaymentMode: {
    type: String,
    enum: ['cash', 'In Account', 'Cash+In Account'],
    required: true,
  },
  tokenAmount: { type: Number, required: true },
  tokenAmountPaidTo: {
    type: String,
    enum: ['piyush', 'omprakash', 'satish','InCompany'],
    required: true,
  },
  dealAmount: { type: Number, required: true },
  anyFinalDiscountFromDealAmount: { type: Number, required: true },
  holdFromCustomer: { type: Number, required: true },
  amountComeFromLoan: { type: Number, required: true },
  totalAmountGotFromCustomerTillNowIncludingToken: { type: Number, required: true },
  
  carTitle: { type: String, required: true },
  carRegistrationNumber: { type: String, required: true },
  customerWhatsappNumber: { type: String, required: true },
  customerMobileNumber: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  customerAddress: { type: String, required: true },

  // Created at with IST
  createdAt: { type: Date, default: getISTDate },
});

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;
