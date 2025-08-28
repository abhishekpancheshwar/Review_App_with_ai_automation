import React, { useState } from 'react';
import api from '../../api'; // Your centralized axios instance
import StarRating from '../common/StarRating';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || !text) {
            alert('Please provide a rating and a review.');
            return;
        }
        try {
            const { data } = await api.post('/reviews', { productId, rating, text });
            onReviewSubmitted(data);
            setText('');
            setRating(0);
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Failed to submit review. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h4>Write a Review</h4>
            <div>
                <label>Your Rating:</label>
                <StarRating rating={rating} onRating={(rate) => setRating(rate)} />
            </div>
            <div>
                <label htmlFor="reviewText">Your Feedback:</label>
                <textarea
                    id="reviewText"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., 'Camera is amazing but battery drains fast'"
                    rows="4"
                ></textarea>
            </div>
            {/* Optional: Add voice note input here */}
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default ReviewForm;