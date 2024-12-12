const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Load environment variables from .env file

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME2,   // Cloudinary cloud name from .env
  api_key: process.env.CLOUDINARY_API_KEY2,         // Cloudinary API key from .env
  api_secret: process.env.CLOUDINARY_API_SECRET2,   // Cloudinary API secret from .env
});

module.exports = cloudinary;
