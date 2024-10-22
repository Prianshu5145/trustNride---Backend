const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dztz5ltuq",   // Your Cloudinary cloud name
  api_key: "449951597736156",         // Your Cloudinary API key
  api_secret: "0pcPd3jZsq8IStxcxpw4ieU4m8g",   // Your Cloudinary API secret
});

module.exports = cloudinary;
