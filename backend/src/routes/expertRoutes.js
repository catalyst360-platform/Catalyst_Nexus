const express = require('express');
const router = express.Router();

const controller = require('../controllers/expertController');

router.post('/apply', controller.applyAsExpert);

module.exports = router;
