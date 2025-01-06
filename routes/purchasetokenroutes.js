const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {createPurchaseToken,getAllPurchaseTokens,getpurchaseTokenCount } = require('../controllers/purchasetokencontroller');
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
  createPurchaseToken, // Controller logic
  deleteUploadedFile // Cleanup temporary file
);




// Route to get token count
router.get('/count', getpurchaseTokenCount );

router.get('/alltokens', getAllPurchaseTokens);


module.exports = router;
