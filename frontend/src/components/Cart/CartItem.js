// components/Cart/CartItem.js
import React from 'react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCart();

    return (
        <div className="py-4 border-b flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
            <div className="flex-1">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.short_description}</p>
                        <p className="text-sm">{item.variant}</p>
                    </div>
                    <button
                        onClick={() => removeFromCart(item.name)}
                        className="text-gray-400"
                    >
                        <img
                            src="/trash.png"
                            alt="trash"
                            className="w-4 h-4 object-contain"
                        />
                    </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">{item.price}₽</span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => updateQuantity(item.name, false)}
                            className="w-8 h-8 rounded-full bg-pink_с text-white flex items-center justify-center"
                        >
                            -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.name, true)}
                            className="w-8 h-8 rounded-full bg-pink_с text-white flex items-center justify-center"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;