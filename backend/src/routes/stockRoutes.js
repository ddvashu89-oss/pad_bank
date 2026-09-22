const express = require('express');
const { listStock, addStock } = require('../controllers/stockController');
const { requireAuth } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth);

router.get('/', asyncHandler(listStock));
router.post('/', asyncHandler(addStock));

module.exports = router;
