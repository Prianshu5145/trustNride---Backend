// routes/reviewRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    uploadReview,
    getAllReviews
} = require('../controllers/reviewController');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    },
});

const upload = multer({ storage });

// Route to upload review
router.post('/upload', upload.single('image'), uploadReview);

// Route to get all reviews
router.get('/', getAllReviews);

module.exports = router;

//priyanshu agrahari
