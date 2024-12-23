import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ title, image, id }) => {
    return (
        <Link to={`/ar/${id}`} className="card-link">
            <div id={id} className="card">
                <img
                    src={image}
                    alt={title}
                // className="w-full h-full object-cover"
                />
                <div className="card-content">
                    <h3>{title}</h3>
                    <span>Перейти к примерке →</span>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;