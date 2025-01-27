import React, { useState } from 'react';
import Modal from 'react-modal';
import ColorPalette from './ColorPalette';
import { useTranslation } from 'react-i18next';

Modal.setAppElement('#root'); // Required for accessibility

const ProductInfoPopup = ({ isOpen, onClose, product }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    if (!product) return null; // Prevent rendering if no product data is passed
    const tabs = [
        {
            id: 0,
            label: t('Description'),
            content: product.description || null,
        },
        {
            id: 1,
            label: t('Contains'),
            content: product.contains || null,
        },
        {
            id: 2,
            label: t('Using'),
            content: product.using || null,
        },
    ];

    const handleCloseClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed inset-0 flex  items-center justify-center z-50 px-4 py-16"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
            <div className="bg-white rounded-lg shadow-lg p-4 w-full h-full max-w-lg relative overflow-y-scroll">
                <button
                    onClick={handleCloseClick}
                    className="absolute top-4 right-4 w-6 h-6 bg-neutral-100 rounded-lg text-gray-600 hover:text-gray-900 text-xl"
                >
                    <div className="absolute w-3 h-0.5 bg-neutral-300 rotate-45 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute w-3 h-0.5 bg-neutral-300 -rotate-45 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"></div>
                </button>
                <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-96 max-w-full rounded-md mb-8"
                />
                <div className="flex flex-row gap-8">
                    <h2 className="basis-3/4 text-xl font-medium mb-1">
                        {product.name}
                    </h2>
                    <p className="basis-1/4 text-gray-800 text-xl font-semibold">
                        {product.price}₽
                    </p>
                </div>
                <p className="w-full font-normal text-base text-gray-700 mb-2">
                    {product.short_description}
                </p>
                <ColorPalette product={product} />

                <div className=" flex mb-4 mt-6 bg-bej rounded-2xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id ? 'activeTabPopap' : ''
                                } rounded-2xl w-1/3 py-2.5 px-1.5 text-sm text-grey`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="font-normal text-base">
                    {tabs[activeTab].content ? (
                        tabs[activeTab].content
                    ) : (
                        <h4>{t("Description will be ready soon")}</h4>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ProductInfoPopup;
