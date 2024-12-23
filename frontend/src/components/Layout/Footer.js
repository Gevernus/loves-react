import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Footer = () => {
    const navigate = useNavigate();
    const { getTotalItems } = useCart();

    const handleBookClick = () => {
        navigate('/');
    };

    const handleBrushClick = () => {
        navigate('/ar/lips');
    };

    const handleCartClick = () => {
        navigate('/cart');
    };
    return (
        <div className="footer">
            <img className="menu" src="/menu.png" alt="menu" />
            <img id="book" src="/book.png" alt="book" onClick={handleBookClick} />
            <img id="brush" src="/brush.png" alt="brush" onClick={handleBrushClick} />
            <div className="icon-container" onClick={handleCartClick} >
                <img id="cart" src="/cart.png" alt="cart" />
                {getTotalItems() > 0 && (
                    <span id="badge" className="badge">
                        {getTotalItems()}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Footer;