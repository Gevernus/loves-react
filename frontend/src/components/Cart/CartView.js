import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import Footer from '../Layout/Footer';

const CartView = () => {
    const { cart, clearCart, getTotalItems, getTotalPrice } = useCart();
    const navigate = useNavigate();
    const shipping = 0; // You might want to make this dynamic or move to a config
    const handleCatalogRedirect = () => {
        navigate('/'); // Redirect to the catalogue page
    };
    if (cart.length === 0) {
        // Empty cart view
        return (
            <div className="app">
                <div className="px-4 py-3 border-b w-full">
                    <h1 className="text-lg font-medium text-center">Моя корзина</h1>
                </div>
                <div className="flex flex-col items-center justify-center flex-1 px-4 py-6 mt-24">
                    <img
                        src="/empty-cart.png"
                        alt="Empty Cart"
                        className="object-contain mb-4"
                    />
                    
                </div>
                <button
                    onClick={handleCatalogRedirect}
                    className="w-full bg-pink-500 text-white rounded-full py-3 mt-4 order-button"
                >
                    Перейти в каталог
                </button>
                <Footer />
            </div>
        );
    }
    return (
        <div className="app">
            <div className="px-4 py-3 border-b w-full">
                <h1 className="text-lg font-medium text-center">Моя корзина</h1>
            </div>
            <div className="cart-content w-full px-2 py-3">
                {/* Cart Summary */}
                <div className="px-4 py-2 flex justify-between items-center border-b">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-medium">{getTotalItems()} товара</span>
                    </div>
                    <button
                        onClick={clearCart}
                        className="flex items-center text-gray-400"
                    >
                        <span>Удалить всё</span>
                        <img
                            src="/trash.png"
                            alt="trash"
                            className="w-4 h-4 ml-1 object-contain"
                        />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-auto px-4">
                    {cart.map(item => (
                        <CartItem key={item.name} item={item} />
                    ))}
                </div>

                {/* Order Summary */}
                <div className="flex flex-col border-t">
                    <h2 className="text-lg font-medium mb-3">Ваш заказ:</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Количество товаров</span>
                            <span>{getTotalItems()} шт.</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Товары на сумму</span>
                            <span>{getTotalPrice()}₽</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center font-medium text-lg">
                        <span>Итого</span>
                        <span>{getTotalPrice() + shipping}₽</span>
                    </div>

                </div>
                <button className="w-full bg-pink-500 text-white rounded-full py-3 mt-4 order-button">
                    Оформить заказ
                </button>
                <Footer />
            </div>
        </div>

    );
};

export default CartView;