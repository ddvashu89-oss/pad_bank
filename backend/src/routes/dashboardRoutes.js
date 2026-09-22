const express = require('express');
const { getDashboard } = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(getDashboard));

module.exports = router;
