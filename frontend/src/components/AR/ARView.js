import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBanuba } from '../../context/BanubaContext';
import ColorPalette from './ColorPalette';
import ProductInfo from './ProductInfo';
import CareSlider from './CareSlider';
import Footer from '../Layout/Footer';
import Header from '../Layout/Header';

import { useProducts } from "../../context/ProductContext";
import SetButton from './SetButton';

const ARView = () => {
    const { category } = useParams();
    const { products } = useProducts();
    const { dom, player } = useBanuba();
    const arContainerRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(category || 'lips'); // Default category
    const [product, setProduct] = useState(null); // State to store selected product
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        const newFilteredProducts = products?.filter(prod => prod.category === selectedCategory) || [];
        setFilteredProducts(newFilteredProducts);
        setProduct(newFilteredProducts.length > 0 ? newFilteredProducts[0] : null);
    }, [selectedCategory, products]);

    useEffect(() => {
        if (arContainerRef.current && !rendered) {
            dom.render(player, arContainerRef.current);
            setRendered(true);
        }
    }, [dom, player]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // Handle product change
    const handleProductChange = (e) => {
        const selectedProduct = filteredProducts.find(prod => prod._id === e.target.value);
        setProduct(selectedProduct);
    };

    return (
        <div className="app">
            <Header />
            <div className="ar-content">
                <div
                    ref={arContainerRef}
                    className="w-full bg-gray-100"
                    id="webar"
                />

                <div className="color-selector">
                    <div className="header">
                        <select
                            id="section-dropdown"
                            className="dropdown"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="lips">Губы</option>
                            <option value="brows">Брови</option>
                            <option value="care">Уход</option>
                            <option value="blushes">Румяна</option>
                            <option value="eyeshadow">Тени</option>
                            <option value="lashes">Ресницы</option>
                            <option value="eyeliner">Подводки</option>
                            <option value="hair">Волосы</option>
                        </select>
                        <img id="1" className="dropdown-arrow" src="/arrow.png" alt="menu" />
                        <select
                            id="product-dropdown"
                            className="dropdown"
                            value={product ? product._id : ''}
                            onChange={handleProductChange}
                            disabled={!filteredProducts?.length}
                        >
                            {filteredProducts?.map((prod) => (
                                <option key={prod._id} value={prod._id}>
                                    {prod.name}
                                </option>
                            ))}
                        </select>
                        <img id="2" className="dropdown-arrow" src="/arrow.png" alt="menu" />
                    </div>

                    {product ? (
                        <>
                            {product.colors && product.colors.length > 0 ? (
                                <>
                                    <ColorPalette product={product} />
                                    <ProductInfo product={product} />
                                </>
                            ) : (
                                <>
                                    <CareSlider product={product} />
                                    <ProductInfo product={product} />
                                </>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-gray-500">No products available in this category.</p>
                    )}
                    <SetButton />
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default ARView;