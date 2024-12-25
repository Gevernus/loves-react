import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Layout/Footer';

const BasketView = () => {
    const navigate = useNavigate();
    
    const handleCartRedirect = () => {
        navigate('/cart'); // Redirect to the cart page
    };
    
    return (
        <div className="app">
            <div >
                <h1 className="text-lg font-medium text-center">Выбор адреса</h1>
            </div>
            <Footer />
        </div>

    );
};

export default BasketView;