const Review = require("../models/Review");
const axios = require("axios");

// @desc    Submit a new review
// @route   POST /api/reviews
// @access  Private
exports.submitReview = async (req, res) => {
  const { productId, rating, text } = req.body;

  try {
    const review = new Review({
      product: productId,
      rating,
      text,
      user: req.user.id, // from authMiddleware
    });

    const createdReview = await review.save();

    // ** TRIGGER N8N WEBHOOK **
    if (process.env.N8N_WEBHOOK_URL) {
      console.log("Triggering n8n webhook...");
      try {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
          reviewId: createdReview._id,
          text: createdReview.text,
        });
      } catch (webhookError) {
        // Log the error but don't fail the request
        console.error("Error triggering n8n webhook:", webhookError.message);
      }
    }

    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update sentiment from n8n
// @route   PUT /api/reviews/:id/sentiment
// @access  Protected (e.g., via API Key)
exports.updateSentiment = async (req, res) => {
  // Simple API key authentication for the webhook callback
  const { sentiment, topics } = req.body;
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== process.env.N8N_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!sentiment) {
        return res.status(400).json({ message: 'Sentiment data is missing from the request body.' });
    }

  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      console.log("--- Database Update ---");
      console.log("Found review before update:", review);
      console.log("Sentiment received from n8n:", req.body.sentiment);

      review.sentiment = req.body.sentiment;
      review.topics = topics || []; 

      const updatedReview = await review.save(); // Save the result to a variable

      console.log("Review after saving to DB:", updatedReview);
      console.log("-------------------------");

      res.json({ message: "Sentiment updated" });
    } else {
      console.log("Review not found in database for ID:", req.params.id);
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all reviews for dashboard
// @route   GET /api/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("product", "name")
      .populate("user", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ... (submitReview, updateSentiment, getAllReviews from previous answer) ...
// The code for those three functions is correct and complete.
// I'll add the missing `getReviewsForProduct` function below.

// @desc    Get reviews for a single product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getReviewsForProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
// Add other controllers for getting reviews by product, etc.


// @desc    Update a user's own review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const oldText = review.text;
        review.rating = req.body.rating || review.rating;
        review.text = req.body.text || review.text;

        // --- NEW LOGIC: RE-TRIGGER N8N IF THE TEXT HAS CHANGED ---
        // We reset the sentiment and topics so the old data doesn't show while re-analyzing.
        if (req.body.text && req.body.text !== oldText) {
            review.sentiment = null;
            review.topics = [];

            // Trigger the n8n webhook with the new text
            if (process.env.N8N_WEBHOOK_URL) {
                console.log('Re-triggering n8n webhook for review update...');
                try {
                    await axios.post(process.env.N8N_WEBHOOK_URL, {
                        reviewId: review._id,
                        text: review.text,
                    });
                } catch (webhookError) {
                    console.error('Error re-triggering n8n webhook:', webhookError.message);
                }
            }
        }

        const updatedReview = await review.save();
        res.json(updatedReview);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Allow deletion if the user is the author OR an admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await review.deleteOne(); // Use deleteOne() for Mongoose v6+
        res.json({ message: 'Review removed' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Admin reply to a review
// @route   POST /api/reviews/:id/reply
// @access  Private/Admin
exports.replyToReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.adminReply = {
            text: req.body.text,
            createdAt: new Date(),
        };

        const updatedReview = await review.save();
        res.json(updatedReview);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};