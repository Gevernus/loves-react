import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Required for accessibility

const ProductInfoPopup = ({ isOpen, onClose, product }) => {
    if (!product) return null; // Prevent rendering if no product data is passed

    const handleCloseClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed inset-0 flex items-center justify-center z-50 px-4 py-16"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-lg relative">
                <button
                    onClick={handleCloseClick}
                    className="absolute top-4 right-4 w-6 h-6 bg-neutral-100 rounded-lg text-gray-600 hover:text-gray-900 text-xl"
                >
                     <div class="absolute w-3 h-0.5 bg-neutral-300 rotate-45 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"></div>
                     <div class="absolute w-3 h-0.5 bg-neutral-300 -rotate-45 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"></div>
                </button>
                <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-96 rounded-md mb-8"
                />
                <div className="flex flex-wrap">
                    <h2 className="w-full max-w-64 text-xl font-medium mb-1">{product.name}</h2>
                    <p className="text-gray-800 text-xl font-semibold pl-8">{product.price}₽</p>
                    <p className="w-full font-normal text-base text-gray-700 mb-2">{product.description}</p>
                </div>
            </div>
        </Modal>
    );
};

export default ProductInfoPopup;
