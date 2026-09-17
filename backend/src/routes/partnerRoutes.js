const express = require('express');
const router = express.Router();

const controller = require('../controllers/partnerController');

router.post('/apply', controller.applyAsPartner);

module.exports = router;
