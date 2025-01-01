const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {createDeal,getAllDeals,getDealById,updateDeal,deleteDeal,getdealCount} = require('../controllers/dealController');
const uploadMedia = require('../utils/whatsapp')
// Configure multer storage (temporary folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporary folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 5MB
  },
});

// Middleware to delete temporary file after processing
const deleteUploadedFile = (req, res, next) => {
  if (req.file) {
    const filePath = req.file.path;
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('Temporary file deleted:', filePath);
        }
      });
    }, 1200000); // Delete after 2 minutes
  }
  next();
};

// POST route to handle token submission
router.post(
  '/create',
  upload.single('pdfFile'), // Multer middleware for single file upload
  createDeal, // Controller logic
  deleteUploadedFile // Cleanup temporary file
);

router.get('/deal/count',getdealCount);
// Route for getting all deals
router.get('/getallDeal', getAllDeals);

// Route for getting a single deal by ID
router.get('/:id', getDealById);

// Route for updating a deal by ID
router.put('/:id', updateDeal);

// Route for deleting a deal by ID
router.delete('/:id', deleteDeal);
//route for deal count 








module.exports = router;
