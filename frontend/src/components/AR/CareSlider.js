import React, { useState } from 'react';

const CareSlider = ({ value, onChange }) => {
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
                onChange={onChange}
            />
        </div>
    );
};

export default CareSlider;