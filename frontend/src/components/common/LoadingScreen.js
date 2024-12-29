import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-6 z-50">
            <img
                src="/loading.png"
                alt="App Logo"
                className="object-contain"
            />
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            {/* <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-lg font-medium text-gray-700">Loading...</span>
            </div> */}
        </div>
    );
};

export default LoadingScreen;