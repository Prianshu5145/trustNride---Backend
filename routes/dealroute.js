const express = require('express');
const router = express.Router();
const {createDeal,getAllDeals,getDealById,updateDeal,deleteDeal} = require('../controllers/dealController');

// Route for creating a deal
router.post('/create', createDeal);

// Route for getting all deals
router.get('/getallDeal', getAllDeals);

// Route for getting a single deal by ID
router.get('/:id', getDealById);

// Route for updating a deal by ID
router.put('/:id', updateDeal);

// Route for deleting a deal by ID
router.delete('/:id', deleteDeal);

module.exports = router;
