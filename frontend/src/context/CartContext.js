import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        console.log(item);
        setCart((prevCart) => {
            const existingItem = prevCart.find(cartItem => cartItem.name === item.name);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.name === item.name
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (name) => {
        setCart(prevCart => prevCart.filter(item => item.name !== name));
    };

    const updateQuantity = (name, increment) => {
        setCart(prevCart => prevCart.map(item =>
            item.name === name
                ? { ...item, quantity: Math.max(1, item.quantity + (increment ? 1 : -1)) }
                : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);