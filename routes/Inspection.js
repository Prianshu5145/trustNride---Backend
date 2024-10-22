const express = require('express');
const router = express.Router();
const { bookInspection } = require('../controllers/inspectionController');

// Route to handle booking submission
router.post('/', bookInspection);

module.exports = router;
