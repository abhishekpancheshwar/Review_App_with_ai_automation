import React, { useState, useEffect } from 'react';
import api from '../api';
import StatsCharts from '../components/AdminDashboard/StatsCharts';
import ReviewList from '../components/AdminDashboard/ReviewList';

const AdminPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // This route is protected by both 'protect' and 'admin' middleware on the backend
                const { data } = await api.get('/reviews');
                setReviews(data);
            } catch (error) {
                setError("Failed to fetch reviews. You may not have admin privileges.");
                console.error("Failed to fetch reviews", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <StatsCharts reviews={reviews} />
            <ReviewList reviews={reviews} />
        </div>
    );
};

export default AdminPage;