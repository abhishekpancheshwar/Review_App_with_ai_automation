import React from 'react';

const StarRating = ({ rating = 0, onRating }) => {
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${rating >= star ? 'on' : 'off'}`}
                    onClick={() => onRating && onRating(star)}
                    style={{ cursor: onRating ? 'pointer' : 'default' }}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
};

export default StarRating;