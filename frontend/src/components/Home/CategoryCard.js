import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ title, image, id }) => {
    return (
        <Link
            to={`/ar/${id}`}
            className="relative block group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
            {/* Image */}
            <div
                id={id}
                className="relative w-full h-48 md:h-56 lg:h-64"
            >
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300" />

                {/* Content - now positioned absolute over the image */}
                <div className="absolute inset-0 px-2 py-1 flex flex-col justify-end">
                    <h3 className="font-semibold text-white truncate">
                        {title}
                    </h3>
                    <span className="text-sm text-white font-medium group-hover:text-blue-200 transition-colors duration-300">
                        Перейти к примерке →
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;