const express = require("express");
const multer = require("multer");
const { createNOC,getNOCByRegistrationNumber,getAllNOCs} = require("../controllers/rtoController");

const router = express.Router();

// Multer setup for handling multiple file uploads
const upload = multer();  // Using default storage (temporary folder)

// Route to create NOC with multiple image uploads
router.post("/noc", upload.fields([
  { name: "form28", maxCount: 5 },
  { name: "customerAadharCard", maxCount: 2 },
  { name: "blankPaperPhoto", maxCount: 3 },
  { name: "ownerAadharCard", maxCount: 2 },
  { name: "ownerPhoto", maxCount: 1 },
  { name: "customerPhoto", maxCount: 1 },
]), createNOC);

// Route to get NOC by ID
router.get("/noc/all", getAllNOCs);

// Route to get NOC by car registration number
router.get('/noc/:carRegistrationNumber', getNOCByRegistrationNumber);

module.exports = router;
