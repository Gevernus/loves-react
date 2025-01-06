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
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                <button
                    onClick={handleCloseClick}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
                >
                    ✖
                </button>
                <h2 className="text-xl font-bold mb-4">{product.name}</h2>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="text-gray-800 font-semibold mb-4">
                    <span className="text-gray-500">Price:</span> ${product.price}
                </p>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full rounded-md"
                />
            </div>
        </Modal>
    );
};

export default ProductInfoPopup;
