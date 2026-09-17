const express = require('express');
const router = express.Router();

const controller = require('../controllers/partnerController');

// 🔍 DEBUG
console.log('Partner Controller:', controller);
console.log('applyAsPartner type:', typeof controller.applyAsPartner);

router.post('/apply', controller.applyAsPartner);

module.exports = router;
