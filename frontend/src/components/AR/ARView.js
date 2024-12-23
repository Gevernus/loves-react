import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAR } from '../../context/ARContext';
import { useBanuba } from '../../context/BanubaContext';
import ColorPalette from './ColorPalette';
import ProductInfo from './ProductInfo';
import Footer from '../Layout/Footer';
import Header from '../Layout/Header';

import { useProducts } from "../../context/ProductContext";

const ARView = () => {
    const { category } = useParams();
    const { products } = useProducts();
    const { params } = useAR();
    const { dom, player, setParams } = useBanuba();
    const arContainerRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(category || 'lips'); // Default category
    const [product, setProduct] = useState(null); // State to store selected product
    const navigate = useNavigate();
    const filteredProducts = products?.filter(prod => prod.category === selectedCategory);

    useEffect(() => {
        // Set the first product of the selected category or handle case when no product is available
        if (filteredProducts?.length > 0) {
            setProduct(filteredProducts[0]);
        } else {
            setProduct(null);
        }
    }, [filteredProducts]);

    useEffect(() => {
        if (arContainerRef.current) {
            dom.render(player, arContainerRef.current);
            if (Object.keys(params).length > 0) {
                // setParams(params);
            }
        }
    }, [dom, player, params, setParams]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        navigate(`/ar/${e.target.value}`);
    };

    // Handle product change
    const handleProductChange = (e) => {
        const selectedProduct = filteredProducts.find(prod => prod.id === e.target.value);
        setProduct(selectedProduct); // Set selected product
    };

    return (
        <div className="app">
            <Header />
            <div className="ar-content">
                <div
                    ref={arContainerRef}
                    className="w-full h-[60vh] bg-gray-100"
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
                            <option value="lips">Lips</option>
                            <option value="brows">Brows</option>
                            <option value="care">Care</option>
                            <option value="blushes">Blushes</option>
                            <option value="eyeshadow">Eyeshadow</option>
                            <option value="lashes">Lashes</option>
                            <option value="eyeliner">Eyeliners</option>
                        </select>
                        <img id="1" className="dropdown-arrow" src="/arrow.png" alt="menu" />
                        <select
                            id="product-dropdown"
                            className="dropdown"
                            value={product ? product.id : ''}
                            onChange={handleProductChange}
                            disabled={!filteredProducts?.length}
                        >
                            {filteredProducts?.map((prod) => (
                                <option key={prod.name} value={prod.name}>
                                    {prod.name}
                                </option>
                            ))}
                        </select>
                        <img id="2" className="dropdown-arrow" src="/arrow.png" alt="menu" />
                    </div>
                    {product ? (
                        <>
                            <ColorPalette product={product} />
                            <ProductInfo product={product} />
                        </>
                    ) : (
                        <p className="text-center text-gray-500">No products available in this category.</p>
                    )}
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default ARView;