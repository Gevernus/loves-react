import React, { useState } from 'react';
import { Share2, Download, X, Loader2 } from 'lucide-react';

const PhotoPreview = ({ photoData, onClose, onUpload, uploadUrl, isUploading }) => {
    const photoUrl = URL.createObjectURL(photoData);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="p-6">
                    <img
                        src={photoUrl}
                        alt="AR Makeup Look"
                        className="w-full h-auto rounded-lg mb-4"
                    />
                    <div className="flex justify-between space-x-4">
                        <button
                            onClick={() => onUpload('story')}
                            disabled={isUploading || !uploadUrl}
                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {isUploading ? (
                                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            ) : (
                                <Share2 className="mr-2 w-5 h-5" />
                            )}
                            Поделиться
                        </button>
                        <button
                            onClick={() => onUpload('save')}
                            disabled={isUploading || !uploadUrl}
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-green-600 transition disabled:opacity-50"
                        >
                            {isUploading ? (
                                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            ) : (
                                <Download className="mr-2 w-5 h-5" />
                            )}
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoPreview;