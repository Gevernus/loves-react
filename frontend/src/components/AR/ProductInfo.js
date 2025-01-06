import React, {useState} from 'react';
import { useCart } from '../../context/CartContext';
import ProductInfoPopup from "./ProductInfoPopup";

const ProductInfo = ({ product }) => {
    const { addToCart } = useCart();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        console.log("Trying to close");
        setIsPopupOpen(false);
    };

    const handleAddToCart = (item) => {
        addToCart(item);
    };
    return (
        <div className="product-info">
            <img
                className="product-image"
                src={product.image}
                alt={product.name}
                onClick={openPopup}
            />
            <div className="product-details" >
                <div className="product-title" onClick={openPopup}>{product.name}</div>
                <img
                    className="recipe-button"
                    src="/buy.png"
                    alt="Buy button"
                    onClick={() => handleAddToCart(product)}
                />
            </div>
            <ProductInfoPopup
                isOpen={isPopupOpen}
                onClose={closePopup}
                product={product}
            />
        </div>
    );
};

export default ProductInfo;