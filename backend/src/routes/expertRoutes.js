const express = require('express');
const router = express.Router();

// Direct import
const controller = require('../controllers/expertController');

// 🔍 DEBUG
console.log('Controller:', controller);
console.log('applyAsExpert type:', typeof controller.applyAsExpert);

// Route
router.post('/apply', controller.applyAsExpert);

module.exports = router;
