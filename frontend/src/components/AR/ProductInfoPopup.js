import React, { useState } from 'react';
import Modal from 'react-modal';
import ColorPalette from './ColorPalette';

Modal.setAppElement('#root'); // Required for accessibility

const ProductInfoPopup = ({ isOpen, onClose }) => {
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
            <div className="bg-white rounded-lg shadow-lg p-4 w-full h-full max-w-lg relative overflow-y-scroll">
                <button
                    onClick={handleCloseClick}
                    className="absolute top-4 right-4 w-6 h-6 bg-neutral-100 rounded-lg text-gray-600 hover:text-gray-900 text-xl"
                >
                    <div className="absolute w-3 h-0.5 bg-neutral-300 rotate-45 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute w-3 h-0.5 bg-neutral-300 -rotate-45 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"></div>
                </button>
                {/* Empty content for testing */}
                <div className="flex justify-center items-center h-full">
                    <h4 className="text-gray-600 text-lg">Empty Page</h4>
                </div>
            </div>
        </Modal>
    );
};

export default ProductInfoPopup;
