const express = require('express');
const multer = require('multer'); // For handling multipart/form-data
const fs = require('fs'); // Import the fs module for file operations
const path = require('path'); // Import path module to work with file paths
const {
  createListing,
  getSellerListings,
  updateListing,
  deleteListing,
} = require('../controllers/listingController');
const { checkApprovedDealer, checkUserRole } = require('../middlewares/listingMiddlewares');
const { isAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();
const { getAllListings, getListingById } = require('../controllers/listingController');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Ensure this path exists

// Create a new listing (only approved sellers can create listings)
router.post('/create', upload.fields([
  { name: 'images', maxCount: 10 }, // Adjust maxCount based on your needs
  { name: 'inspectionReport[exterior][lhsTyre][image]', maxCount: 1 },
  { name: 'inspectionReport[exterior][rhsTyre][image]', maxCount: 1 },
  { name: 'inspectionReport[exterior][lhsRearTyre][image]', maxCount: 1 },
  { name: 'inspectionReport[exterior][rhsRearTyre][image]', maxCount: 1 },
  { name: 'inspectionReport[exterior][spareTyre][image]', maxCount: 1 },
  { name: 'inspectionReport[engine][video]', maxCount: 1 }, // Engine Video
]), async (req, res) => {
  try {
    // Call your createListing function here to handle the listing logic
    await createListing(req, res);

    // Schedule the deletion of the files after 1 hour (3600000 milliseconds)
    const deletionDelay = 600000; // 1 hour

    req.files.forEach(file => {
      const filePath = path.join(__dirname, '../', file.path); // Adjust the path as necessary

      // Set a timeout to delete the file after the specified time
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
          } else {
            console.log(`Successfully deleted file: ${filePath}`);
          }
        });
      }, deletionDelay);
    });

    res.status(201).json({ message: 'Listing created successfully' });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Failed to create listing' });
  }
});

// Get all listings (accessible to buyers)
router.get('/alllisting', getAllListings);

// Get seller's own listings
router.get('/seller', isAuthenticated, checkUserRole(['dealer']), getSellerListings);

// Update a listing (admins can update any listing, sellers can update their own)
router.patch('/update/:id', isAuthenticated, checkUserRole(['dealer', 'admin']), updateListing);

// Delete a listing (admins can delete any listing, sellers can delete their own)
router.delete('/delete/:id', isAuthenticated, checkUserRole(['dealer', 'admin']), deleteListing);

// Get a listing by ID
router.get('/find/:id', getListingById);

module.exports = router;
