import React from 'react';
import { useSetContext } from "../../context/SetContext";
import { useTranslation } from 'react-i18next';

const ColorPalette = ({ product }) => {
    const { toggleProductSelection } = useSetContext();
    const { t } = useTranslation();

    const handleColorSelect = (color) => {
        toggleProductSelection(product.id, color);
    };

    return (
        <div id="color-palette" className="color-palette">
            <div
                className="color-circle"
                style={{ backgroundColor: 'transparent', border: '1px dashed #ccc' }}
                title="No Color"
                onClick={() => handleColorSelect(null)} // Handle "No Color"
            ></div>
            {product.colors.length > 0 ?
                (product.colors.map((color, index) => (
                    <div
                        key={index}
                        className="color-circle"
                        style={{ backgroundColor: color }}
                        title={`Color ${index + 1}`}
                        onClick={() => handleColorSelect(color)}
                    ></div>
                ))
                ) : (
                    <p>{t("No color palette available for this product.")}</p>
                )}
        </div>
    );
};

export default ColorPalette;