import React from 'react';
import { useCart } from '../../context/CartContext';

const ProductInfo = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (item) => {
        addToCart(item);
    };
    return (
        <div className="product-info">
            <img
                className="product-image"
                src={product.image}
                alt={product.name}
            />
            <div className="product-details">
                <div className="product-title">{product.name}</div>
                <img
                    className="recipe-button"
                    src="/buy.png"
                    alt="Buy button"
                    onClick={() => handleAddToCart(product)}
                />
            </div>
        </div>
    );
};

export default ProductInfo;