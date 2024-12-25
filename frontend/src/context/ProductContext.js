import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from the backend
    const fetchProducts = async () => {
        try {
            // const response = await fetch("https://touch-the-beauty-ai.shop/api/products");
            const response = await fetch("http://localhost:8000/api/products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, loading, refresh: fetchProducts }}>
            {children}
        </ProductContext.Provider>
    );
};