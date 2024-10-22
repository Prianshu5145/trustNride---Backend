const Booking = require('../models/inspection');
const sendEmail = require('../utils/sendEmail');

// Booking controller function
exports.bookInspection = async (req, res) => {
    const { name, vehicleNumber, mobileNumber } = req.body;

    // Save to database
    try {
        const newBooking = new Booking({ name, vehicleNumber, mobileNumber });
        await newBooking.save();

        // Prepare email details
        const subject = 'New Car Inspection Booking';
        const message = `You have a new booking:\n\nName: ${name}\nVehicle Number: ${vehicleNumber}\nMobile Number: ${mobileNumber}`;

        // Send email notification to admin
        await sendEmail({
            email: "agraharipriyanshu52@gmail.com", // Admin email
            subject: subject,
            message: message,
        });

        // Only send response here if everything goes well
        return res.status(200).json({ message: 'Booking saved and email sent successfully.' });

    } catch (error) {
        console.error('Error:', error);

        // Send an error response if something goes wrong
        return res.status(500).json({ message: 'Failed to save booking or send email.' });
    }
};
