const express = require('express');
const router = express.Router();
const { getFilteredCars,getVehicleByChassis } = require('../controllers/findcar');

router.post('/cars', getFilteredCars);
router.post('/ch-verify', getVehicleByChassis);
module.exports = router;
