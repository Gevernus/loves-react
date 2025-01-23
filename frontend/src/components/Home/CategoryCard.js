import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ title, image, id }) => {
    return (
        <Link
            to={`/ar/${id}`}
            className="relative block group overflow-hidden rounded-lg bg-bej shadow-md hover:shadow-lg transition-shadow duration-300"
        >
           
            <div
                id={id}
                className="relative w-full p-2 flex flex-col justify-end"
            >
                <img
                    src={image}
                    alt={title}
                    className="w-full h-32 mb-2 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <h3 className="font-semibold text-blue_с truncate">{title}</h3>
                <span className="text-[13px] ext-blue_с font-normal group-hover:text-pink_с transition-colors duration-300">
                    Перейти к примерке →
                </span>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300" />
            </div>
        </Link>
    );
};

export default CategoryCard;
