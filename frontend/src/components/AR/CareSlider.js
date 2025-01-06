import React, { useState } from 'react';
import { useSetContext } from "../../context/SetContext";

const CareSlider = ({ product }) => {
    const [value, setValue] = useState(0.0);
    const { toggleProductSelection } = useSetContext();

    const handleChange = (event) => {
        setValue(event.target.value);
        toggleProductSelection(product.id, event.target.value);
    };
    return (
        <div id="care-slider" className="slider-section" style={{ display: 'block' }}>
            <label htmlFor="softlight-slider">Softlight:</label>
            <input
                type="range"
                id="softlight-slider"
                min="0"
                max="1"
                step="0.1"
                value={value}
                onChange={handleChange}
            />
        </div>
    );
};

export default CareSlider;