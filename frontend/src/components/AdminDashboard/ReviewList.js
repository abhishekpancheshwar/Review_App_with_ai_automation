import React, { useState, useMemo } from 'react';

const ReviewList = ({ reviews }) => {
    const [filterProduct, setFilterProduct] = useState('');
    const [filterSentiment, setFilterSentiment] = useState('');

    const uniqueProducts = useMemo(() => {
        const productNames = reviews.map(r => r.product?.name).filter(Boolean);
        return [...new Set(productNames)];
    }, [reviews]);

    const filteredReviews = useMemo(() => {
        return reviews.filter(review => {
            const productMatch = filterProduct ? review.product?.name === filterProduct : true;
            const sentimentMatch = filterSentiment ? (review.sentiment === filterSentiment || (filterSentiment === 'Unanalyzed' && review.sentiment === null)) : true;
            return productMatch && sentimentMatch;
        });
    }, [reviews, filterProduct, filterSentiment]);

    return (
        <div className="review-table-container">
            <h3>All Reviews</h3>
            <div className="filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)}>
                    <option value="">All Products</option>
                    {uniqueProducts.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
                <select value={filterSentiment} onChange={e => setFilterSentiment(e.target.value)}>
                    <option value="">All Sentiments</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Unanalyzed">Unanalyzed</option>
                </select>
            </div>
            <table className="review-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>User</th>
                        <th>Rating</th>
                        <th>Review Text</th>
                        <th>Sentiment</th>
                        <th>AI-Generated Topics</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReviews.map(review => (
                        <tr key={review._id}>
                            <td>{review.product?.name || 'N/A'}</td>
                            <td>{review.user?.name || 'N/A'}</td>
                            <td>{review.rating} ★</td>
                            <td>{review.text}</td>
                            <td>
                                <span className={`sentiment-${review.sentiment || 'Unanalyzed'}`}>
                                    {review.sentiment || 'N/A'}
                                </span>
                            </td>
                            <td>
                                {review.topics && review.topics.length > 0
                                    ? review.topics.join(', ')
                                    : 'N/A'}
                            </td>
                            <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewList;