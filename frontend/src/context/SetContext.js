import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from './UserContext';
import { useBanuba } from './BanubaContext';
import { useProducts } from "./ProductContext";
import { useCart } from './CartContext';
import { useUpload } from "./UploadContext";
import WebApp from '@twa-dev/sdk';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const SetContext = createContext();

export const useSetContext = () => useContext(SetContext);

export const SetProvider = ({ children }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productSets, setProductSets] = useState([]);
    const { user, setUser } = useUser();
    const { setParam, clear, takePhoto } = useBanuba();
    const { getCategoryById, getProductById } = useProducts();
    const { addToCart } = useCart();
    const { uploadToCloudinary, isUploadingPhoto } = useUpload();

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
    const toggleProductSelection = async (productId, value) => {
        setSelectedProducts((prevSelected) => {
            // Get the category of the current product:
            const newProductCategoryId = getCategoryById(productId);

            // 1. Remove any product from the same category:
            const updatedProducts = prevSelected.filter((p) => {
                const existingCategoryId = getCategoryById(p.productId);
                return existingCategoryId !== newProductCategoryId;
            });

            // 2. If value is null, we're simply removing (unselecting):
            if (value === null) {
                return updatedProducts;
            }

            // 3. Otherwise, add the new product:
            return [...updatedProducts, { productId, value }];
        });
        if (!user.photo?.url && !isUploadingPhoto) {
            try {
                const photoBlob = await takePhoto(); // Capture photo
                const photoUrl = await uploadToCloudinary(photoBlob); // ✅ Upload via UploadContext

                if (!photoUrl) {
                    console.error("Failed to upload photo");
                    return;
                }

                // ✅ Send API request to update user with photo URL
                const payload = { photo: { url: photoUrl, uploadedAt: new Date() } };
                const response = await fetch(`${apiUrl}/users/${user._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    setUser(updatedUser);
                } else {
                    console.error("Failed to update user:", response.statusText);
                }
            } catch (error) {
                console.error("Error handling photo:", error);
            }
        }
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