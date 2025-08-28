import React from 'react';
import { Link } from 'react-router-dom';

const ProductList = ({ products }) => {
    return (
        <div className="product-list">
            {products.map((product) => (
                <div key={product._id} className="product-card">
                    <Link to={`/product/${product._id}`}>
                        <img src={product.imageUrl} alt={product.name} />
                        <h3>{product.name}</h3>
                    </Link>
                    <p>{product.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductList;