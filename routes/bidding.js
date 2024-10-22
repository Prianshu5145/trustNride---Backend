const express = require('express');
const router = express.Router();
const { checkApprovedDealer ,checkUserRole} = require('../middlewares/listingMiddlewares');
const {isAuthenticated}=require('../middlewares/authMiddleware');
const {createBidding,placeBid,getAllBiddingListings,getBiddingListingById}=require('../controllers/biddingController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Ensure this path exists
console.log(upload);
// Route for creating a new bidding (only for approved sellers)
router.post('/create-bid',isAuthenticated,checkUserRole(['admin']) ,upload.array('images', 6), createBidding);
//get all the bidding listed
router.get('/bidding-listings', getAllBiddingListings);
//to get listings by id
router.get('/biddingListings/:id', getBiddingListingById);
// Route for placing a bid
router.post('/place-bid/:listingId', isAuthenticated,checkUserRole(['dealer','buyer']), placeBid);

module.exports = router;
