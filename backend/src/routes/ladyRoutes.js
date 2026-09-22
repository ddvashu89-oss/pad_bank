const express = require('express');
const {
    listLadies,
    searchByAadhaar,
    getLady,
    createLady,
    updateLady,
} = require('../controllers/ladyController');
const { requireAuth } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth);

// /search must be registered before /:id so it isn't swallowed by the param route.
router.get('/search', asyncHandler(searchByAadhaar));
router.get('/', asyncHandler(listLadies));
router.get('/:id', asyncHandler(getLady));
router.post('/', asyncHandler(createLady));
router.put('/:id', asyncHandler(updateLady));

module.exports = router;
