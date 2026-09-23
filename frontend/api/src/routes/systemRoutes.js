const express = require('express');
const { getStatus } = require('../controllers/systemController');
const { requireAuth } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/status', requireAuth, asyncHandler(getStatus));

module.exports = router;
