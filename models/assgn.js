const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  offerPrice: { type: String },
  images: [{ type: String }], 
  MRP: { type: String },
  Category: { type: String },
  Specification: {
    ModelID: { type: String, required: true },
    Type: { type: String, required: true },
    CompatibleDesign: { type: String, required: true },
    BluetoothVersion: { type: String },
    BluetoothRange: { type: String },
    BatteryLife: { type: String },
    Playtime: { type: String },
    StandbyTime: { type: String },
    DomesticWarranty: { type: String },
    CoveredinWarranty: { type: String },
  },
  Physical: {
    Dimension: {
      Width: { type: String },
      Height: { type: String },
      Depth: { type: String },
      Weight: { type: String },
      Volume: { type: String },
    },
  },
});

module.exports = mongoose.model('Product', productSchema);
