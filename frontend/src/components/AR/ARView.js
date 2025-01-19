import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useBanuba } from '../../context/BanubaContext';
import ColorPalette from './ColorPalette';
import ProductInfo from './ProductInfo';
import CareSlider from './CareSlider';
import Footer from '../Layout/Footer';
import Header from '../Layout/Header';
import { useProducts } from "../../context/ProductContext";
import SetButton from './SetButton';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const ARView = () => {
    const { category } = useParams();
    const { products } = useProducts();
    const { dom, player } = useBanuba();
    const arContainerRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(category || 'lips');
    const [product, setProduct] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        const newFilteredProducts = products?.filter(prod => prod.category === selectedCategory) || [];
        setFilteredProducts(newFilteredProducts);
        setProduct(newFilteredProducts.length > 0 ? newFilteredProducts[0] : null);
    }, [selectedCategory, products]);

    useEffect(() => {
        if (arContainerRef.current && !rendered) {
            console.log('render');
            dom.render(player, arContainerRef.current);
            setRendered(true);
        }
    }, [dom, player]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSlideChange = (swiper) => {
        const selectedProduct = filteredProducts[swiper.activeIndex];
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
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="product-swiper-container">
                            <Swiper
                                modules={[Navigation]}
                                navigation={{
                                    nextEl: '.swiper-button-next-custom',
                                    prevEl: '.swiper-button-prev-custom',
                                }}
                                spaceBetween={0}
                                slidesPerView={1}
                                onSlideChange={handleSlideChange}
                                className="product-info-swiper"
                            >
                                {filteredProducts.map((prod) => (
                                    <SwiperSlide key={prod._id}>
                                        <div className="product-card">
                                            {prod.colors && prod.colors.length > 0 ? (
                                                <>
                                                    <ColorPalette product={prod} />
                                                    <ProductInfo product={prod} />
                                                </>
                                            ) : (
                                                <>
                                                    <CareSlider product={prod} />
                                                    <ProductInfo product={prod} />
                                                </>
                                            )}
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className="swiper-button-prev-custom">
                                <img src="/arrow-left.png" alt="Previous" />
                            </div>
                            <div className="swiper-button-next-custom">
                                <img src="/arrow-right.png" alt="Next" />
                            </div>
                        </div>
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