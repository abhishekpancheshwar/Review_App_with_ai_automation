import React, { useState, useEffect } from 'react';
import ProductList from '../components/Product/ProductList';
import api from '../api';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
             <div className="text-3xl font-bold text-red-900 text-center mt-10">
      🚀 Tailwind is Working!
    </div>
            <h1>Our Products</h1>
            <ProductList products={products} />
        </div>
    );
};

export default HomePage;