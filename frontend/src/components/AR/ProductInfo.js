import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import ProductInfoPopup from './ProductInfoPopup';
import { useTranslation } from 'react-i18next';

const ProductInfo = ({ product }) => {
    const { t } = useTranslation();
    const { addToCart } = useCart();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const handleAddToCart = (item) => {
        addToCart(item);
    };
    return (
        <div className="product-info px-3.5">
            <img
                className="object-cover w-24 h-28 rounded-lg"
                src={product.image}
                alt={product.name}
                onClick={openPopup}
            />

            <div className="">
                <div onClick={openPopup}>
                    <div className="text-blue_с text-sm font-semibold">
                        {product.name}
                    </div>
                    <div className="text-grey text-sm font-normal">
                        {product.short_description}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <p className="text-blue_с text-base font-semibold">
                        {product.price}₽
                    </p>
                    <button
                        className="bg-white text-sm text-pink_с max-w-24 w-full border border-pink_с rounded-lg px-1 py-1"
                        onClick={() => handleAddToCart(product)}
                    >
                        {t('Buy')}
                    </button>
                </div>
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
