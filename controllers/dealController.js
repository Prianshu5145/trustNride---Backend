const Deal = require('../models/deal');

// Create a new deal
exports.createDeal = async (req, res) => {
    try {
        const {
            totalAmountGotTillNowExcludingToken,
            amountPaidToSatish,
            amountPaidToSatishBy,
            amountPaidToPiyush,
            amountPaidToCompanyAccount,
            amountPaidToPiyushBy,
            amountPaidToOmprakash,
            amountPaidToOmprakashBy,
            CustomerPaymentMode,
            tokenAmount,
            tokenAmountPaidTo,
            dealAmount,
            anyFinalDiscountFromDealAmount,
            holdFromCustomer,
            amountComeFromLoan,
            totalAmountGotFromCustomerTillNowIncludingToken,
            carTitle,
            carRegistrationNumber,
            customerWhatsappNumber,
            customerMobileNumber,
            customerName,
            customerAddress,
        } = req.body;

        const newDeal = new Deal({
            totalAmountGotTillNowExcludingToken,
            amountPaidToSatish,
            amountPaidToSatishBy,
            amountPaidToPiyush,
            amountPaidToCompanyAccount,
            amountPaidToPiyushBy,
            amountPaidToOmprakash,
            amountPaidToOmprakashBy,
            CustomerPaymentMode,
            tokenAmount,
            tokenAmountPaidTo,
            dealAmount,
            anyFinalDiscountFromDealAmount,
            holdFromCustomer,
            amountComeFromLoan,
            totalAmountGotFromCustomerTillNowIncludingToken,
            carTitle,
            carRegistrationNumber,
            customerWhatsappNumber,
            customerMobileNumber,
            customerName,
            customerAddress,
        });

        await newDeal.save();
        res.status(201).json({ message: 'Deal created successfully!', newDeal });
    } catch (error) {
        res.status(500).json({ error: 'Error creating deal', message: error.message });
    }
};

// Get all deals
exports.getAllDeals = async (req, res) => {
    try {
        const deals = await Deal.find();
        res.status(200).json(deals);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching deals', message: error.message });
    }
};

// Get a single deal by ID
exports.getDealById = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ error: 'Deal not found' });
        }
        res.status(200).json(deal);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching deal', message: error.message });
    }
};

// Update a deal by ID
exports.updateDeal = async (req, res) => {
    try {
        const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!deal) {
            return res.status(404).json({ error: 'Deal not found' });
        }
        res.status(200).json({ message: 'Deal updated successfully', deal });
    } catch (error) {
        res.status(500).json({ error: 'Error updating deal', message: error.message });
    }
};

// Delete a deal by ID
exports.deleteDeal = async (req, res) => {
    try {
        const deal = await Deal.findByIdAndDelete(req.params.id);
        if (!deal) {
            return res.status(404).json({ error: 'Deal not found' });
        }
        res.status(200).json({ message: 'Deal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting deal', message: error.message });
    }
};
