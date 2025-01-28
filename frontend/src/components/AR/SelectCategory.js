import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SelectCategory = ({ handleCategoryChange, selectedCategory }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const categories = [
        { value: 'lips', label: t('Lips'), imgSrc: '/lips-icon.png' },
        { value: 'brows', label: t('Brows'), imgSrc: '/brows-icon.png' },
        { value: 'care', label: t('Care'), imgSrc: '/care-icon.png' },
        { value: 'blushes', label: t('Blushes'), imgSrc: '/blushes-icon.png' },
        { value: 'eyeshadow', label: t('Eyeshadow'), imgSrc: '/eyeshadow-icon.png' },
        { value: 'lashes', label: t('Lashes'), imgSrc: '/lashes-icon.png' },
        { value: 'eyeliner', label: t('Eyeliner'), imgSrc: '/eyeliner-icon.png' },
        { value: 'hair', label: t('Hair'), imgSrc: '/hair-icon.png' },
    ];

    const toggleDropdown = () => {
        setIsOpen(!isOpen); // Switching the state of the open list
    };

    const handleItemClick = (value) => {
        handleCategoryChange(value); 
        setIsOpen(false);
    };

    // Filter so that the selected category is not displayed in the list
    const filteredCategories = categories.filter((category) => category.value !== selectedCategory);

    return (
        <div className="dropdown-container font-semibold text-blue_с">
            {/* The button to open/close the list */}
            <div className="" onClick={toggleDropdown}>
                <div className="dropdown-item cursor-pointer mb-1.5">
                    <img className="inline-block w-6 h-6" src={categories.find(category => category.value === selectedCategory)?.imgSrc} alt={selectedCategory} />
                    <span className='ml-1.5 mr-2.5'>{categories.find(category => category.value === selectedCategory)?.label}</span>
                    <img id="1" className="inline-block dropdown-arrow" src="/arrow.png" alt="menu" />
                </div>
            </div>

            {/* Drop-down list */}
            {isOpen && (
                <div className="dropdown-list flex flex-col space-y-2.5">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.value}
                            className={`dropdown-item cursor-pointer flex ${selectedCategory === category.value ? 'active' : ''}`}
                            onClick={() => handleItemClick(category.value)}
                        >
                            <img className='w-6 h-6' src={category.imgSrc} alt={category.label} />
                            <p className='mx-1.5'>{category.label}</p>                          
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectCategory;
