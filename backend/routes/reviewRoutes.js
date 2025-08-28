const express = require('express');
const router = express.Router();
const { 
    submitReview, 
    updateSentiment, 
    getAllReviews, 
    getReviewsForProduct,
    deleteReview,
    updateReview,
    replyToReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, submitReview).get(protect, admin, getAllReviews);
router.route('/:id/sentiment').put(updateSentiment);
router.route('/product/:productId').get(getReviewsForProduct);

// --- ADD THESE NEW ROUTES ---
router.route('/:id')
    .put(protect, updateReview)      // For a user to update their own review
    .delete(protect, deleteReview);  // For a user or admin to delete a review

router.route('/:id/reply')
    .post(protect, admin, replyToReview);

module.exports = router;