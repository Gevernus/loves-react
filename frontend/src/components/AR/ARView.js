import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useBanuba } from '../../context/BanubaContext';
import { Camera } from 'lucide-react';
import ColorPalette from './ColorPalette';
import ProductInfo from './ProductInfo';
import CareSlider from './CareSlider';
import Footer from '../Layout/Footer';
import Header from '../Layout/Header';
import { useProducts } from "../../context/ProductContext";
import SetButton from './SetButton';
import WebApp from '@twa-dev/sdk';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const ARView = () => {
    const { category } = useParams();
    const { products } = useProducts();
    const { dom, player, takePhoto } = useBanuba();
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

    const handlePhotoCapture = async () => {
        try {
            // Capture photo using Banuba's takePhoto function
            const photoData = await takePhoto(); // Assume this returns a Blob

            // Generate a timestamp for the file name
            const date = new Date();
            const dateString = date.toISOString()
                .replace(/[:.]/g, '-')  // Replace colons and dots with hyphens
                .replace('T', '_')      // Replace 'T' with an underscore
                .slice(0, 19);          // Take only the date and time part

            // Save to device
            if (photoData) {
                const link = document.createElement('a');
                link.download = `ar-makeup-look_${dateString}.jpg`;
                link.href = URL.createObjectURL(photoData);
                link.click();
                URL.revokeObjectURL(link.href);
            } else {
                console.error('No photo data captured.');
            }
        } catch (error) {
            console.error('Error capturing photo:', error);
        }
    };

    const fallbackToTelegram = () => {
        const telegramLink = `https://t.me/share/url?url=https://t.me/Loves_ai_for_you_bot/LoVeS&text=${encodeURIComponent('Зацени мой образ в приложении Loves AR!')}`;
        WebApp.openTelegramLink(telegramLink);
    };

    return (
        <div className="app">
            <Header />
            <div className="ar-content relative">
                {/* Photo capture button */}
                <button
                    onClick={handlePhotoCapture}
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    aria-label="Take photo"
                >
                    <Camera className="w-6 h-6 text-gray-700" />
                </button>

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