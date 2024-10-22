// controllers/reviewController.js
const Review = require('../models/Review');
const cloudinary = require('../utils/cloudinary');// Import Cloudinary config

// Upload Review
const uploadReview = async (req, res) => {
    try {
        const { name, place, review } = req.body;

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create new review with Cloudinary image URL
        const newReview = new Review({ 
            name, 
            place, 
            review, 
            imageUrl: result.secure_url // Use the secure URL returned by Cloudinary
        });
        await newReview.save();

        res.status(201).json({ message: 'Review uploaded successfully!', review: newReview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    uploadReview,
    getAllReviews,
};
