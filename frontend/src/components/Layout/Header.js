import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    // State to track if the dropdown is open
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };
    return (
        <div className="container">
            <img className='logo-header' src='/logo-header.png'></img>
            <img className='menu-burger' src='/menu-burger.png' onClick={toggleDropdown}></img>
            {isDropdownOpen && (
                <div className="dropdown-menu absolute top-14 right-4 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-40">
                    <button
                        onClick={() => navigate('/my-sets')}
                        className="w-full px-4 py-2 text-left text-m text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                    >
                        Мои наборы
                    </button>
                    <button
                        onClick={() => navigate('/referrals')}
                        className="w-full px-4 py-2 text-left text-m text-gray-700 hover:bg-gray-100"
                    >
                        Рефералы
                    </button>
                </div>
            )}
        </div>

    );
};

export default Header;