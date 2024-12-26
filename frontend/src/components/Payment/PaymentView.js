import React from 'react';
import './PaymentView.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Layout/Footer';

const PaymentView = () => {
    const navigate = useNavigate();

    const handleCartRedirect = () => {
        navigate('/cart'); // Redirect to the cart page
    };


    return (
        <div className="app">
            <div className='container-payment px-4'>
                <div className="relative px-4 py-3 border-b w-full">
                    <h1 className="text-lg font-medium text-center">Оформление заказа</h1>
                    <div
                        onClick={handleCartRedirect}
                        className="absolute top-4 right-4 w-6 h-6">
                        <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2 rotate-45"></span>
                        <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2 -rotate-45"></span>
                    </div>
                </div>
                <h1 className="mt-8 mb-6 text-lg font-medium text-center">Выберите способ оплаты</h1>
                <div className='flex flex-col items-center w-full'>
                    <div className='item-payment flex justify-between items-center px-4 w-full h-16 rounded-3xl bg-bej'>
                        <div className='flex items-center'>
                            <div >
                                <img
                                    src="/robocassa.png"
                                    alt="Robokassa icon"
                                    className="object-contain"
                                />
                            </div>
                            <span className='ml-2'>Robokassa</span>
                        </div>
                        <label>
                            <input
                                type="radio"
                            />
                        </label>
                    </div>

                </div>
                <button
                    className="bg-pink-500 text-white rounded-full py-3 mt-60 order-button payment-button">
                    продолжить
                </button>
            </div>
            <Footer />
        </div>

    );
};

export default PaymentView;