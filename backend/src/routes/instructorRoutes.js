const express = require('express');
const { submitInstructorApplication } = require('../controllers/instructorController');

const router = express.Router();

/**
 * POST /api/instructor/apply
 * Submit instructor application
 */
router.post('/apply', submitInstructorApplication);

module.exports = router;
