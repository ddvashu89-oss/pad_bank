const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const { requireAuth } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(getAnalytics));

module.exports = router;
