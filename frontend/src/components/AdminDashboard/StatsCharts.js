import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StatsCharts = ({ reviews }) => {
    // Memoize calculations to avoid re-computing on every render
    const { sentimentData, avgRatingData } = useMemo(() => {
        const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0 };
        const productRatings = {};

        reviews.forEach(review => {
            // Sentiment count
            if (review.sentiment) {
                sentimentCounts[review.sentiment]++;
            }
            // Product rating aggregation
            if (!productRatings[review.product.name]) {
                productRatings[review.product.name] = { total: 0, count: 0 };
            }
            productRatings[review.product.name].total += review.rating;
            productRatings[review.product.name].count++;
        });

        const sentimentData = [
            { name: 'Positive', value: sentimentCounts.Positive },
            { name: 'Negative', value: sentimentCounts.Negative },
            { name: 'Neutral', value: sentimentCounts.Neutral },
        ];

        const avgRatingData = Object.keys(productRatings).map(name => ({
            name,
            'Average Rating': (productRatings[name].total / productRatings[name].count).toFixed(2),
        }));

        return { sentimentData, avgRatingData };
    }, [reviews]);


    const COLORS = { Positive: '#4CAF50', Negative: '#F44336', Neutral: '#FFC107' };

    return (
        <div className="charts-container">
            <h3>Analytics Dashboard</h3>
            <div className="chart-wrapper">
                <h4>Sentiment Breakdown</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                            {sentimentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="chart-wrapper">
                <h4>Average Rating Per Product</h4>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={avgRatingData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Average Rating" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StatsCharts;