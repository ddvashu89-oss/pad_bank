const express = require('express');
const {
    listDistributions,
    getDistribution,
    createDistribution,
} = require('../controllers/distributionController');
const { requireAuth } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth);

router.get('/', asyncHandler(listDistributions));
router.get('/:id', asyncHandler(getDistribution));
router.post('/', asyncHandler(createDistribution));

module.exports = router;
