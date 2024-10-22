const Contact = require('../models/contactModel');

// Handle contact form submission
const submitContactForm = async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ message: 'Contact form submitted successfully!' });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Please fill all red mark fields' });
    }
};

module.exports = {
    submitContactForm,
};
