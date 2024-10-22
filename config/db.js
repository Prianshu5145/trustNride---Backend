const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file
//mongodb+srv://agraharipriyanshu52:hV1owk0gc7kXeY5S@cluster0.nu0kl.mongodb.net/
//mongoimport --uri "mongodb+srv://agraharipriyanshu52:hV1owk0gc7kXeY5S@cluster0.mongodb.net/test" --collection biddinglistings --file "C:\Users\agrah\OneDrive\Desktop\trustnride1.biddinglistings.json" --jsonArray

const mongoUri = "mongodb+srv://agraharipriyanshu52:hV1owk0gc7kXeY5S@cluster0.nu0kl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
