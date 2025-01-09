import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from './UserContext';
import { useBanuba } from './BanubaContext';
import { useProducts } from "./ProductContext";
import { useCart } from './CartContext';
import WebApp from '@twa-dev/sdk';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const SetContext = createContext();

export const useSetContext = () => useContext(SetContext);

export const SetProvider = ({ children }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productSets, setProductSets] = useState([]);
    const { user } = useUser();
    const { setParam, clear } = useBanuba();
    const { getCategoryById, getProductById } = useProducts();
    const { addToCart } = useCart();

    useEffect(() => {
        clear();
        selectedProducts.forEach(({ productId, value }) => {
            const category = getCategoryById(productId); // Replace with your logic
            setParam(category, value);
        });
    }, [selectedProducts, setParam, getCategoryById]);

    useEffect(() => {
        if (!user) return;
        const fetchSets = async () => {
            try {
                const response = await fetch(`${apiUrl}/sets?userId=${user._id}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setProductSets(data);
            } catch (error) {
                console.error("Error fetching sets:", error);
            }
        };

        fetchSets();
    }, [user]);    

    // Toggle a product's selection status
    const toggleProductSelection = (productId, value) => {
        setSelectedProducts((prevSelected) => {
            const existingProduct = prevSelected.find((p) => p.productId === productId);

            if (value === null) {
                // If value is null, remove the product
                return prevSelected.filter((p) => p.productId !== productId);
            } else if (existingProduct) {
                // If the product exists, update its value
                return prevSelected.map((p) =>
                    p.productId === productId ? { ...p, value } : p
                );
            } else {
                // If the product does not exist, add it
                return [...prevSelected, { productId, value }];
            }
        });
    };

    // Save the current selection as a new set with a unique ID
    const saveSet = async () => {
        try {
            const response = await fetch(`${apiUrl}/sets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user._id, products: selectedProducts }),
            });
            const data = await response.json();
            setProductSets((prevSets) => [...prevSets, data]); // Add the new set to state
        } catch (error) {
            console.error("Error saving set:", error);
        }
    };

    // Select an existing set by ID
    const selectSet = (setId) => {
        const foundSet = productSets.find((set) => set.id === setId);
        if (foundSet) {
            setSelectedProducts(foundSet.products);
        } else {
            console.error(`Set with ID "${setId}" not found`);
        }
    };

    const shareSet = async (setId) => {
        const foundSet = productSets.find((set) => set.id === setId);
        if (foundSet) {
            try {
                const response = await fetch(`${apiUrl}/share-links`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: user._id,
                        selectedProducts: foundSet.products
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to create share link');
                }

                const data = await response.json();

                // Open the generated Telegram link
                WebApp.openTelegramLink(`https://t.me/share/url?url=${data.telegramLink}`);
            } catch (error) {
                console.error('Error sharing set:', error);
            }
        } else {
            console.error(`Set with ID "${setId}" not found`);
        }
    };

    const buySet = (setId) => {
        const foundSet = productSets.find((set) => set.id === setId);
        if (foundSet) {
            foundSet.products.forEach((product) => {
                addToCart(getProductById(product.productId));
            });
        } else {
            console.error(`Set with ID "${setId}" not found`);
        }
    };

    // Remove a set by ID
    const removeSet = async (setId) => {
        try {
            await fetch(`${apiUrl}/sets/${setId}`, {
                method: "DELETE",
            });
            setProductSets((prevSets) => prevSets.filter((set) => set.id !== setId)); // Remove the set from state
        } catch (error) {
            console.error("Error removing set:", error);
        }
    };

    const contextValue = {
        selectedProducts,
        toggleProductSelection,
        productSets,
        saveSet,
        selectSet,
        removeSet,
        buySet,
        shareSet,
        setSelectedProducts
    };

    return <SetContext.Provider value={contextValue}>{children}</SetContext.Provider>;
};