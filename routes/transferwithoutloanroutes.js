const express = require("express");
const multer = require("multer");
const { createTRANSFERWITHOUTLOAN,getTRANSFERWITHOUTLOANByRegistrationNumber,getAllgetTRANSFERWITHOUTLOAN} = require("../controllers/transferwithoutloan");

const router = express.Router();

// Multer setup for handling multiple file uploads
const upload = multer();  // Using default storage (temporary folder)

// Route to create NOC with multiple image uploads
router.post("/transferwithoutloan", upload.fields([
  { name: "form28", maxCount: 5 },
  { name: "form29", maxCount: 5 },
  { name: "form30", maxCount: 5 },
  { name: "noc", maxCount: 5 },
  { name: "CarRc", maxCount: 5 },
  { name: "customerAadharCard", maxCount: 3 },
  { name: "blankPaperPhoto", maxCount: 3 },
  { name: "ownerAadharCard", maxCount: 3 },
  { name: "ownerPhoto", maxCount: 1 },
  { name: "customerPhoto", maxCount: 1 },
]), createTRANSFERWITHOUTLOAN);

// Route to get NOC by ID
router.get("/transferwithoutloan/all", getAllgetTRANSFERWITHOUTLOAN);

// Route to get NOC by car registration number
router.get('/transferwithoutloan/:carRegistrationNumber', getTRANSFERWITHOUTLOANByRegistrationNumber);

module.exports = router;
