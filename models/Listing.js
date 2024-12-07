const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    FairMarketValue: { type: String, required: true },
    KM: { type: String, required: true },
    
    overview: {
      registrationYear: { type: Number, required: true },
      insurance: { type: String, enum: ['available', 'not available'], required: true },
      fuelType: { type: String, required: true },
      seats: { type: String, required: true },
      kmsDriven: { type: String, required: true },
      rto: { type: String, required: true },
      ownership: { type: String, required: true },
      transmission: { type: String, required: true },
      yearOfManufacture: { type: String, required: true },
      mileage: { type: String, required: true }
    },

    inspectionReport: {
      carDocuments: {
        rcAvailability: { type: String, enum: ['Available', 'Not Available'], required: true },
        mismatchInRC: { type: String, enum: ['Yes', 'No'], required: true },
        rtoNOCIssued: { type: String, enum: ['Yes', 'No'], required: true },
        insuranceType: { type: String, enum: ['comprehensive', 'Third Party', 'Expired'], required: true },
        noClaimBonus: { type: String, enum: ['Yes', 'No'], required: true }
      },
      exterior: {
        lhsTyre: {
          image: { type: String, required: true },
          condition: { type: String, enum: ['excellent', 'good', 'average'], required: true }
        },
        rhsTyre: {
          image: { type: String, required: true },
          condition: { type: String, enum: ['excellent', 'good', 'average'], required: true }
        },
        lhsRearTyre: {
          image: { type: String, required: true },
          condition: { type: String, enum: ['excellent', 'good', 'average'], required: true }
        },
        rhsRearTyre: {
          image: { type: String, required: true },
          condition: { type: String, enum: ['excellent', 'good', 'average'], required: true }
        },
        spareTyre: {
          image: { type: String, required: true }
        }
      },
      engine: {
        majorSound: { type: String, enum: ['Yes', 'No'], required: true },
        blowBy: { type: String, enum: ['Yes', 'No'], required: true },
        backCompression: { type: String, enum: ['Yes', 'No'], required: true },
        engineMounting: { type: String, enum: ['Yes', 'No'], required: true },
        video: { type: String, required: false }
      },
      ac: {
        acWorking: { type: String, enum: ['Working', 'Not Working'], required: true },
        heaterWorking: { type: String, enum: ['Working', 'Not Working'], required: true }
      },
      electrical: {
        powerWindows: { type: Number, required: true },
        airbagFeature: { type: Number, required: true },
        musicSystem: { type: String, enum: ['Available', 'Not Available'], required: true },
        parkingSensor: { type: String, enum: ['Available', 'Not Available'], required: true },
        centralLock: { type: String, enum: ['Available', 'Not Available'], required: true }
      },
      steering: {
        steeringCondition: { type: String, enum: ['Hard', 'Normal'], required: true },
        brakeCondition: { type: String, enum: ['Hard', 'Normal'], required: true },
        suspensionCondition: { type: String, enum: ['Normal', 'Hard'], required: true }
      }
    },
    InspectionReportVideoLink : { type: String, required: false },
  },
  

  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
