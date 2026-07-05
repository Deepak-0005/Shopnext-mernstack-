import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { apiFetch } from '../api';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiFetch('/api/products');
                const data = await res.json();
                console.log('Home fetch /api/products', { status: res.status, data });
                if (!res.ok) {
                    throw new Error(data?.message || 'Failed to load products');
                }
                if (!Array.isArray(data)) {
                    throw new Error('Unexpected products response format');
                }
                setProducts(data.slice(0, 4)); // Featured products
            } catch (error) {
                console.error('Home failed:', error);
                setError(error.message || 'Unable to load products.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    return(
        <div className="home-container">
            <div className="hero-banner">
                <h1>Welcome to ShopNext</h1>
                <p>Discover the best products at unbeatable prices.</p>
            </div>
            <h2>Featured Products</h2>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div style={{ color: '#f97316' }}>{error}</div>
            ) : products.length === 0 ? (
                <div>No featured products available.</div>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};
export default Home;