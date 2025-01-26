import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import CartItem from './CartItem';
import Footer from '../Layout/Footer';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

const CartView = () => {
    const { user } = useUser();
    const { cart, clearCart, getTotalItems, getTotalPrice } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const shipping = 0; // You might want to make this dynamic or move to a config
    const handleCatalogRedirect = () => {
        navigate('/'); // Redirect to the catalogue page
    };
    // const handleBasketRedirect = () => {
    //     navigate('/basket'); // Redirect to the Basket page
    // };
    const handleBasketRedirect = () => {
        navigate('/payment'); // Redirect to the Basket page
    };

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/create-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user._id,
                    items: cart.map(item => ({
                        productId: item._id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    total: getTotalPrice()
                })
            });

            const data = await response.json();
            console.log(response);
            if (!response.ok) {

                throw new Error(data.error || 'Ошибка при создании платежа');
            }

            if (data.paymentUrl) {
                // Redirect to PayKeeper payment page
                window.location.href = data.paymentUrl;
                // clearCart(); // Clear cart after successful payment initialization
            }

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        // Empty cart view
        return (
            <div className="app">
                <div className="px-4 py-3 border-b w-full">
                    <h1 className="text-lg font-medium text-center">Моя корзина</h1>
                </div>
                <div className="flex flex-col items-center justify-center flex-1 px-4 py-6 mt-12">
                    <img
                        src="/empty-cart.png"
                        alt="Empty Cart"
                        className="object-contain mb-4"
                    />

                </div>
                <button
                    onClick={handleCatalogRedirect}
                    className="bg-pink_с text-white rounded-full py-3 mt-4 order-button"
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
            <div className="cart-content w-full mb-28  px-2 py-3">
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

                <div className="flex-1 overflow-auto px-4">
                    {cart.map(item => (
                        <CartItem key={item.name} item={item} />
                    ))}
                </div>

                <div className="flex flex-col mt-8">
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
                        <span>{getTotalPrice()}₽</span>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    onClick={handlePayment}
                    disabled={true}
                    className="bg-pink_с text-white rounded-full py-3 mt-4 order-button disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Обработка...' : 'Оплатить'}
                </button>
                <Footer />
            </div>
        </div>
    );
};

export default CartView;