const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // MongoDB connection config
const authRoutes = require('./routes/authRoutes'); // Importing routes
const listingRoutes = require('./routes/listingRoutes');
const cors = require('cors');
const biddingRoutes = require('./routes/bidding');
const bookingRoute = require('./routes/Inspection');
const reviewRoutes = require('./routes/reviewRoutes');
const contactRoutes = require('./routes/contactRoutes');
const rtoRoutes = require("./routes/rtoroutes");
const transferRoutes = require("./routes/transferwithloanroutes");
const transferRouteswithoutloan = require("./routes/transferwithoutloanroutes");
const tokenRoutes = require("./routes/tokenroute");
const Dealroute = require('./routes/dealroute');
dotenv.config(); // Load environment variables

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware to parse incoming JSON
app.use(express.json());
app.use(cors());
app.use('/api/listings', listingRoutes);
// Authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/bidding', biddingRoutes);
app.use('/api/inspection', bookingRoute);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/rto", rtoRoutes);
app.use("/api/rtotransfer", transferRoutes);
app.use("/api/rtotransferwithouthypo", transferRouteswithoutloan);
app.use('/api/token', tokenRoutes);
app.use('/api/deal', Dealroute);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
