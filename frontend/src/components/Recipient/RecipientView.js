import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Layout/Footer';

const RecipientView = () => {
    const navigate = useNavigate();
    
    const handleCartRedirect = () => {
        navigate('/cart'); // Redirect to the cart page
    };
    const handlePaymentRedirect = () => {
        navigate('/payment'); // Redirect to the Recipient page
    };
    
    return (
        <div className="app">
            <div className="relative px-4 py-3 border-b w-full">
                <h1 className="text-lg font-medium text-center">Оформление заказа</h1>
                <div
                 onClick={handleCartRedirect} 
                className="absolute top-4 right-4 w-6 h-6">
                  <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2 rotate-45"></span>
                  <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2 -rotate-45"></span>
                </div>
            </div>
            <button
                 onClick={handlePaymentRedirect}
                 className="bg-pink-500 text-white rounded-full py-3 mt-4 order-button">
                    Сохранить и продолжить
            </button>
            <Footer />
        </div>

    );
};

export default RecipientView;