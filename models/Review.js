// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: false },
    place: { type: String, required: false },
    review: { type: String, required: false },
    imageUrl: { type: String, required: false },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
