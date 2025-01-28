import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Only one import needed

const Header = () => {
    const { t, i18n } = useTranslation(); // Get translation functions
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ru' 
        ? 'en' 
        : i18n.language === 'en' 
            ? 'ar' 
            : 'ru';
        i18n.changeLanguage(newLang);
        localStorage.setItem('i18nextLng', newLang);
    };

    return (
        <div className="container">
            <img className='logo-header' src='/logo-header.png' alt="Logo" />

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleLanguage}
                    className="text-sm font-medium hover:text-[#f468a4] transition-colors"
                >
                    {i18n.language === 'ru' ? 'Ru' : i18n.language === 'en' ? 'En' : 'Ar'}
                </button>
            
                <img
                    className='menu-burger'
                    src='/menu-burger.png'
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    alt="Menu"
                />
            </div>

            {isDropdownOpen && (
                <div className={`dropdown-menu absolute top-14  bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-40 ${i18n.language === 'ar' ? 'left-4' : 'right-4'}`}>
                    <button
                        onClick={() => navigate('/my-sets')}
                        className="w-full px-4 py-2 text-left text-m text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                    >
                        {t('My sets')} {/* Simple translation call */}
                    </button>
                    <button
                        onClick={() => navigate('/bonuses')}
                        className="w-full px-4 py-2 text-left text-m text-gray-700 hover:bg-gray-100"
                    >
                        {t('My bonuses')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Header;