import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from the backend
    const fetchProducts = async () => {
        try {
            // const response = await fetch("https://touch-the-beauty-ai.shop/api/products");
            const response = await fetch(`${apiUrl}/products`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryById = (productId) => {
        const product = products.find((p) => p.id === productId);
        if (product) {
            return product.category || null; // Return the category or null if not available
        } else {
            console.warn(`Product with ID ${productId} not found`);
            return null;
        }
    };

    const getProductById = (productId) => {
        return products.find((p) => p.id === productId);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, loading, refresh: fetchProducts, getCategoryById, getProductById }}>
            {children}
        </ProductContext.Provider>
    );
};