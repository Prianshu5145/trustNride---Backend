const mongoose = require("mongoose");

const PurchaseDealSchema = new mongoose.Schema({
  carTitle: { type: String, required: true },
  
carModel: {
  type: String,
  required: false,
  default: null
},
  customerName: { type: String, required: true },
  customerMobile: { type: Number, required: true },
  whatsappMobile: { type: Number, required: true },
  AccountholderName: { type: String, required: true },
  AfterPickUpReceivableGD: { type: [String], required: true },
  BankACCNo: { type: String, required: true },
  BankIfsc: { type: String, required: true },
  CxBankName: { type: String, required: true },
  CxBankPaidAmount: { type: Number, required: true },
  DueAmount: { type: Number, required: true },
  LoanPaidBy: { type: String, required: true },
  LoanPaymentAmount: { type: Number, required: true },
  LoanpaymentStatus: { type: String, required: true },
  NocHoldbackAmount: { type: Number, required: true },
  PartipeshiHoldbackAmount: { type: Number, required: true },
  PickUpRecievedGD: { type: [String], required: true },
  carRegistrationNumber: { type: String, required: true },
  challanAmount: { type: Number, required: true },
  customerEmail: { type: String, required: true },
  dealDoneAmount: { type: Number, required: true },
  tokenAmount: { type: Number, required: true },

});

const PurchaseDealModel = mongoose.model("PurchaseDealModel", PurchaseDealSchema);

module.exports = PurchaseDealModel;
