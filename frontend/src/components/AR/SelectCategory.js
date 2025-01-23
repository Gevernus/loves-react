import React, { useState } from 'react';

const SelectCategory = ({ handleCategoryChange, selectedCategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const categories = [
        { value: 'lips', label: 'Губы', imgSrc: '/lips-icon.png' },
        { value: 'brows', label: 'Брови', imgSrc: '/brows-icon.png' },
        { value: 'care', label: 'Уход', imgSrc: '/care-icon.png' },
        { value: 'blushes', label: 'Румяна', imgSrc: '/blushes-icon.png' },
        { value: 'eyeshadow', label: 'Тени', imgSrc: '/eyeshadow-icon.png' },
        { value: 'lashes', label: 'Ресницы', imgSrc: '/lashes-icon.png' },
        { value: 'eyeliner', label: 'Подводки', imgSrc: '/eyeliner-icon.png' },
        { value: 'hair', label: 'Волосы', imgSrc: '/hair-icon.png' },
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
                    <img className="inline-block" src={categories.find(category => category.value === selectedCategory)?.imgSrc} alt={selectedCategory} />
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
                            className={`dropdown-item cursor-pointer ${selectedCategory === category.value ? 'active' : ''}`}
                            onClick={() => handleItemClick(category.value)}
                        >
                            <img className="inline-block mr-1.5" src={category.imgSrc} alt={category.label} />
                            {category.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectCategory;
