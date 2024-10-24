const express = require('express');
const multer = require('multer'); // For handling multipart/form-data
const {
  createListing,
  
  getSellerListings,
  updateListing,
  deleteListing,
} = require('../controllers/listingController');
const { checkApprovedDealer ,checkUserRole} = require('../middlewares/listingMiddlewares');
const {isAuthenticated}=require('../middlewares/authMiddleware');
const router = express.Router();
const {getAllListings,getListingById,} = require('../controllers/listingController');
// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Ensure this path exists
console.log(upload);
// Create a new listing (only approved sellers can create listings)
router.post('/create', upload.fields([
  { name: 'images', maxCount: 5 }, // Adjust maxCount based on your needs
  { name: 'inspectionReport[exterior][lhsTyre][image]', maxCount: 1 },
  { name: 'inspectionReport[exterior][rhsTyre][image]', maxCount: 1 },
  { name: 'inspectionReport[exterior][lhsRearTyre][image]', maxCount: 1 },
  { name: 'inspectionReport[exterior][rhsRearTyre][image]', maxCount: 1 },
  { name: 'inspectionReport[exterior][spareTyre][image]', maxCount: 1 },
  { name: 'inspectionReport[engine][video]', maxCount: 1 },// Engine Video
]), createListing);

// Get all listings (accessible to buyers)
//router.get('/userlistings', getAllListings);
router.get('/alllisting', getAllListings);
// Get seller's own listings
router.get('/seller',isAuthenticated,checkUserRole(['dealer']) ,getSellerListings);

// Update a listing (admins can update any listing, sellers can update their own)
router.patch('/update/:id', isAuthenticated,checkUserRole(['dealer','admin']),updateListing);

// Delete a listing (admins can delete any listing, sellers can delete their own)
router.delete('/delete/:id',isAuthenticated,checkUserRole(['dealer', 'admin']), deleteListing);
//
router.get('/find/:id', getListingById);

module.exports = router;
