import React from 'react';
import { useBanuba } from '../../context/BanubaContext';

const ColorPalette = ({ product }) => {
    const { setParam } = useBanuba();
    const handleColorSelect = (color) => {
        setParam(product.category, convertColorToNormalized(color));
    };

    function convertColorToNormalized(color) {
        let r = 0, g = 0, b = 0, a = 1; // Default to black with full opacity
        if (!color) return color;

        if (color.startsWith("#")) {
            // Convert HEX format to RGBA
            if (color.length === 7) {
                // #RRGGBB
                r = parseInt(color.slice(1, 3), 16);
                g = parseInt(color.slice(3, 5), 16);
                b = parseInt(color.slice(5, 7), 16);
            } else if (color.length === 4) {
                // #RGB (short-hand notation)
                r = parseInt(color[1] + color[1], 16);
                g = parseInt(color[2] + color[2], 16);
                b = parseInt(color[3] + color[3], 16);
            }
        } else if (color.startsWith("rgba")) {
            // Extract RGBA values from rgba(R, G, B, A)
            const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d?.?\d+)?\)/);
            if (rgbaMatch) {
                r = parseInt(rgbaMatch[1], 10);
                g = parseInt(rgbaMatch[2], 10);
                b = parseInt(rgbaMatch[3], 10);
                a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
            }
        } else if (color.startsWith("rgb")) {
            // Extract RGB values from rgb(R, G, B)
            const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                r = parseInt(rgbMatch[1], 10);
                g = parseInt(rgbMatch[2], 10);
                b = parseInt(rgbMatch[3], 10);
                a = 1; // Fully opaque if no alpha
            }
        } else if (/^\d+\s\d+\s\d+(\s\d?.?\d+)?$/.test(color)) {
            // Parse space-separated format: "R G B A" or "R G B"
            const parts = color.split(" ");
            r = parseInt(parts[0], 10);
            g = parseInt(parts[1], 10);
            b = parseInt(parts[2], 10);
            a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
        }

        // Normalize each value
        const rNormalized = (r / 255).toFixed(2);
        const gNormalized = (g / 255).toFixed(2);
        const bNormalized = (b / 255).toFixed(2);
        const aNormalized = a.toFixed(2);

        return `${rNormalized} ${gNormalized} ${bNormalized} ${aNormalized}`;
    }
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
                    <p>No color palette available for this product.</p>
                )}
        </div>
    );
};

export default ColorPalette;