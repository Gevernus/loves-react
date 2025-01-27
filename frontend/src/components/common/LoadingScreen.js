import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingScreen = () => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-6 z-50 px-7">
            <img
                src="/logo-header.png"
                alt="App Logo"
                className="object-contain loading-logo"
            />
            <p className='font-semibold text-3xl text-center text-blue_с'>{t("Be the best version of yourself")}</p>
            <div className="w-8 h-8 border-4 border-pink_с border-t-transparent rounded-full animate-spin" />
            {/* <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-pink_с border-t-transparent rounded-full animate-spin" />
                <span className="text-lg font-medium text-gray-700">Loading...</span>
            </div> */}
        </div>
    );
};

export default LoadingScreen;