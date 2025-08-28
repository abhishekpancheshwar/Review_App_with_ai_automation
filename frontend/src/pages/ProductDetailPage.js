import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating'; // Assuming this component exists
import ReviewForm from '../components/Product/ReviewForm'; // Import the new form

// --- Futuristic ReviewItem Component ---
// This component handles the display and interaction for a single review.
const ReviewItem = ({ review, onReviewDeleted, onReviewUpdated }) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(review.text);
    const [editRating, setEditRating] = useState(review.rating);

    const isAuthor = user && user.id === review.user._id;

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await api.delete(`/reviews/${review._id}`);
                onReviewDeleted(review._id);
            } catch (error) {
                console.error('Failed to delete review:', error);
                alert('Could not delete the review. Please try again.');
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data: updatedReview } = await api.put(`/reviews/${review._id}`, {
                text: editText,
                rating: editRating,
            });
            onReviewUpdated(updatedReview);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update review:', error);
            alert('Could not update the review. Please try again.');
        }
    };

    // --- STYLES FOR FUTURISTIC UI ---
    const reviewCardStyle = {
        background: 'linear-gradient(145deg, #1e1e2f, #2a2a3e)',
        border: '1px solid #4a4a6a',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        position: 'relative',
        color: '#e0e0e0',
    };

    const adminReplyStyle = {
        background: 'rgba(74, 74, 106, 0.3)',
        borderLeft: '3px solid #8a2be2', // A vibrant purple
        borderRadius: '8px',
        padding: '15px',
        marginTop: '15px',
        fontStyle: 'italic',
    };

    const buttonStyle = {
        background: 'none',
        border: '1px solid #8a2be2',
        color: '#8a2be2',
        padding: '5px 10px',
        borderRadius: '20px',
        cursor: 'pointer',
        marginLeft: '10px',
        transition: 'all 0.3s ease',
    };

    return (
        <div style={reviewCardStyle}>
            {isAuthor && (
                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                    <button style={buttonStyle} onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</button>
                    <button style={buttonStyle} onClick={handleDelete}>Delete</button>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ color: '#ffffff', fontSize: '1.1em' }}>{review.user?.name || 'Anonymous'}</strong>
            </div>

            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <div style={{ marginBottom: '10px' }}>
                        <StarRating rating={editRating} onRating={setEditRating} />
                    </div>
                    <textarea 
                        value={editText} 
                        onChange={(e) => setEditText(e.target.value)}
                        style={{ width: '100%', background: '#2a2a3e', border: '1px solid #4a4a6a', color: '#e0e0e0', borderRadius: '8px', padding: '10px' }}
                    />
                    <button type="submit" style={{ ...buttonStyle, marginTop: '10px', background: '#8a2be2', color: 'white' }}>Save Changes</button>
                </form>
            ) : (
                <>
                    <StarRating rating={review.rating} />
                    <p style={{ lineHeight: '1.6' }}>{review.text}</p>
                    {review.adminReply?.text && (
                        <div style={adminReplyStyle}>
                            <strong style={{ color: '#8a2be2' }}>Reply from Admin:</strong>
                            <p style={{ margin: '5px 0 0' }}>{review.adminReply.text}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};


// --- UPDATED: ProductDetailPage ---
const ProductDetailPage = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductAndReviews = async () => {
            try {
                setLoading(true);
                const [productRes, reviewsRes] = await Promise.all([
                    api.get(`/products/${id}`),
                    api.get(`/reviews/product/${id}`)
                ]);
                setProduct(productRes.data);
                setReviews(reviewsRes.data);
            } catch (err) {
                console.error('Failed to load product details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductAndReviews();
    }, [id]);

    const handleReviewSubmitted = (newReview) => {
        setReviews([newReview, ...reviews]);
    };

    const handleReviewDeleted = (reviewId) => {
        setReviews(reviews.filter(r => r._id !== reviewId));
    };

    const handleReviewUpdated = (updatedReview) => {
        setReviews(reviews.map(r => r._id === updatedReview._id ? updatedReview : r));
    };

    if (loading) return <p>Loading...</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <div>
            {/* ... Product Header ... */}
            <div style={{ marginBottom: '40px', color: 'white' }}>
                 <h1>{product.name}</h1>
                 <p>{product.description}</p>
            </div>

            <div className="reviews-section">
                <h2 style={{ color: 'white', borderBottom: '2px solid #8a2be2', paddingBottom: '10px' }}>Customer Reviews</h2>
                {isAuthenticated && (
                    <div style={{ margin: '20px 0' }}>
                        <ReviewForm productId={id} onReviewSubmitted={handleReviewSubmitted} />
                    </div>
                )}
                <div className="review-list">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <ReviewItem 
                                key={review._id} 
                                review={review} 
                                onReviewDeleted={handleReviewDeleted}
                                onReviewUpdated={handleReviewUpdated}
                            />
                        ))
                    ) : (
                        <p style={{ color: '#a0a0a0' }}>No reviews yet. Be the first to write one!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;