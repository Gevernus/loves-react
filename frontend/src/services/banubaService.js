const SDK_VERSION = "1.16.1";
const BANUBA_CLIENT_TOKEN = "Qk5CIFApqZvBZxvc25FAsvs//deRJA1LdWzSRNPF4MCYF6zyxF+I6+4dJomus47rnfTBBDr/pNTTi9ETlIzndZHoOTFBjiPYpHnfSzDQ508o39qqJmBVLJ8oV7dHFuBpq2Os9/1rAQArQRXbMDwCgDXhedcK4GC4YFrQbk/ouGbYZIBjS+tSnWohNPzx2rZceW1cyiRgNg1Jw4zADPH3KRWZ+H21t5w3cgZzTSQ6dKD4ysHKIRoI6/tjWb9v2k/EG5U+9Hnd91cs5hV203PCiTyfcQcuUBQcF5THIuM+hceQVsKSpCPmEJiqE1429NpuqCcZuzQpdoTCRqWYB4pXk4SF316ZQIypiCIMpu3XaF9N6TiP0rB7EziDneZcWMEUY1XqhKOm44/L6oEtdYBP6bPlgdvuIo5msNuS9eexjpIJrhU7AnixLoM5KBr/2OdIEI/kGe41y2k3GtCRhh/gximOT4EvPdn5BU1MQTRnitMJ9EYPHLYnlXYQyQ51w0VqKlRPHUyANeQRFB6+pg6iR7Tk0FalkDCJLoUqsCNMqwdOI1hzGWBrJitIPjrkaf2CeGtP92A5URV4dkI8qRJFYIYbJpv77UKlIYK3rlo0lEAmoe0a8qdywZp1OkiCkQbSTuVyqp67YkyT9M81jSSZ+0U=";

const modulesList = [
    "face_tracker",
    "lips",
    "hair"
];

class BanubaService {
    constructor() {
        this.player = null;
        this.effect = null;
        this.isInitialized = false;
        this.categoryMapping = {
            lips: 'Lips.color',
            brows: 'Brows.color',
            eyeshadow: 'Makeup.eyeshadow',
            eyeliner: 'Makeup.eyeliner',
            hair: 'Hair.color',
            blushes: 'Makeup.blushes',
            lashes: 'Eyelashes.color',
            care: 'Softlight.strength'
        };
    }

    async initialize() {
        if (this.isInitialized) return;
        try {
            // const { Dom, Player, Module, Effect, Webcam } = await import(
            //     `https://cdn.jsdelivr.net/npm/@banuba/webar@${SDK_VERSION}/dist/BanubaSDK.browser.esm.min.js`
            // );

            const { Dom, Player, Module, Effect, Webcam } = await eval(
                `import('https://cdn.jsdelivr.net/npm/@banuba/webar@${SDK_VERSION}/dist/BanubaSDK.browser.esm.min.js')`
            );

            this.player = await Player.create({
                clientToken: BANUBA_CLIENT_TOKEN,
                locateFile: `https://cdn.jsdelivr.net/npm/@banuba/webar@${SDK_VERSION}/dist`
            });

            // Load all required modules
            await Promise.all(
                modulesList.map(async (moduleId) => {
                    try {
                        const module = await Module.preload(
                            `https://cdn.jsdelivr.net/npm/@banuba/webar@${SDK_VERSION}/dist/modules/${moduleId}.zip`
                        );
                        await this.player.addModule(module);
                    } catch (error) {
                        console.warn(`Load module ${moduleId} error: `, error);
                    }
                })
            );
            const width = 540;
            const height = 640;
            // Initialize camera
            // const webcam = new Webcam({
            //     width,
            //     height,
            // });
            const webcam = new Webcam();
            this.player.use(webcam);

            // Load effect
            this.effect = new Effect('/assets/effects/Makeup_new_morphs.zip');
            await this.player.applyEffect(this.effect);

            this.isInitialized = true;
            return { Dom, player: this.player };

        } catch (error) {
            console.error('Failed to initialize Banuba:', error);
            throw error;
        }
    }

    convertColorToNormalized(color) {
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

    setParam(key, value) {
        console.log(`Trying to set param: ${key}:${value}`);
        if (!this.effect || !this.isInitialized) {
            throw new Error('Banuba not initialized');
        }

        if (key !== 'care') {
            value = this.convertColorToNormalized(value);
        }

        const category = this.categoryMapping[key];

        if (!category) {
            return;
        }

        // Dynamically execute the JavaScript to set the parameter
        const formattedValue = key === 'care' ? value || '0.0' : value || '0 0 0 0';
        this.effect.evalJs(`${category}("${formattedValue}")`);
    }

    clear() {
        if (!this.effect) return;
        Object.keys(this.categoryMapping).forEach(key => {
            const category = this.categoryMapping[key];
            const formattedValue = key === 'care' ? '0.0' : '0 0 0 0';
            this.effect.evalJs(`${category}("${formattedValue}")`);
        });
    }
}

export default new BanubaService();