const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false },
    mobile: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: String, required: true },
    FairMarketValue: { type: String, required: true },
    Carid: { type: String, required: true },
    message: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
