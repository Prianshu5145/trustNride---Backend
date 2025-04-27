const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dummytokenController = require('../controllers/dummytokenController');

const upload = multer();



// POST route to handle token submission
router.post(
  '/submit-dummytoken',
  upload.none(),
  dummytokenController.submitdummyTokenForm, // Controller logic
 
);




// Route to get token count
router.get('/dummytokens/count', dummytokenController.getTokendummyCount);




module.exports = router;
