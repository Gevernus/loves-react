// Constants moved to a separate config file for better maintainability
const CONFIG = {
    SDK_VERSION: "1.16.1",
    BANUBA_CLIENT_TOKEN: "Qk5CIFApqZvBZxvc25FAsvs//deRJA1LdWzSRNPF4MCYF6zyxF+I6+4dJomus47rnfTBBDr/pNTTi9ETlIzndZHoOTFBjiPYpHnfSzDQ508o39qqJmBVLJ8oV7dHFuBpq2Os9/1rAQArQRXbMDwCgDXhedcK4GC4YFrQbk/ouGbYZIBjS+tSnWohNPzx2rZceW1cyiRgNg1Jw4zADPH3KRWZ+H21t5w3cgZzTSQ6dKD4ysHKIRoI6/tjWb9v2k/EG5U+9Hnd91cs5hV203PCiTyfcQcuUBQcF5THIuM+hceQVsKSpCPmEJiqE1429NpuqCcZuzQpdoTCRqWYB4pXk4SF316ZQIypiCIMpu3XaF9N6TiP0rB7EziDneZcWMEUY1XqhKOm44/L6oEtdYBP6bPlgdvuIo5msNuS9eexjpIJrhU7AnixLoM5KBr/2OdIEI/kGe41y2k3GtCRhh/gximOT4EvPdn5BU1MQTRnitMJ9EYPHLYnlXYQyQ51w0VqKlRPHUyANeQRFB6+pg6iR7Tk0FalkDCJLoUqsCNMqwdOI1hzGWBrJitIPjrkaf2CeGtP92A5URV4dkI8qRJFYIYbJpv77UKlIYK3rlo0lEAmoe0a8qdywZp1OkiCkQbSTuVyqp67YkyT9M81jSSZ+0U=",
    BASE_CDN_URL: `https://cdn.jsdelivr.net/npm/@banuba/webar@1.16.1/dist`,
    MODULES_LIST: ["face_tracker", "lips", "hair"],
    CATEGORY_MAPPING: {
        lips: 'Lips.color',
        brows: 'Brows.color',
        eyeshadow: 'Makeup.eyeshadow',
        eyeliner: 'Makeup.eyeliner',
        hair: 'Hair.color',
        blushes: 'Makeup.blushes',
        lashes: 'Eyelashes.color',
        care: 'Softlight.strength'
    }
};

class BanubaService {
    constructor() {
        this.player = null;
        this.effect = null;
        this.isInitialized = false;
        this.moduleCache = new Map();
        this.sdkInstance = null;
        this.initPromise = null;
    }

    // Implement module caching
    async loadModule(moduleId) {
        if (this.moduleCache.has(moduleId)) {
            return this.moduleCache.get(moduleId);
        }

        try {
            const module = await this.sdkInstance.Module.preload(
                `${CONFIG.BASE_CDN_URL}/modules/${moduleId}.zip`
            );
            this.moduleCache.set(moduleId, module);
            return module;
        } catch (error) {
            console.warn(`Failed to load module ${moduleId}:`, error);
            throw error;
        }
    }

    // Implement SDK caching
    async loadSDK() {
        if (this.sdkInstance) {
            return this.sdkInstance;
        }

        try {
            // Use dynamic import with local caching
            const sdk = await eval(
                `import('${CONFIG.BASE_CDN_URL}/BanubaSDK.browser.esm.min.js')`
            );
            this.sdkInstance = sdk;
            return sdk;
        } catch (error) {
            console.error('Failed to load Banuba SDK:', error);
            throw error;
        }
    }

    // Implement singleton pattern for initialization
    async initialize() {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = this._initialize();
        return this.initPromise;
    }

    async _initialize() {
        if (this.isInitialized) return { Dom: this.sdkInstance.Dom, player: this.player };

        try {
            const sdk = await this.loadSDK();
            const { Player, Webcam } = sdk;

            this.player = await Player.create({
                clientToken: CONFIG.BANUBA_CLIENT_TOKEN,
                locateFile: CONFIG.BASE_CDN_URL
            });

            // Load and cache modules in parallel
            await Promise.all(
                CONFIG.MODULES_LIST.map(async (moduleId) => {
                    const module = await this.loadModule(moduleId);
                    await this.player.addModule(module);
                })
            );

            // Initialize webcam with optimal settings
            const webcam = new Webcam({
                width: 520,
                height: 640,
                constraints: {
                    video: {
                        width: { ideal: 520 },
                        height: { ideal: 640 },
                        frameRate: { ideal: 30, max: 30 },
                        facingMode: 'user',
                        resizeMode: 'crop-and-scale'
                    }
                }
            });

            this.player.use(webcam);

            // Load and cache effect
            this.effect = new sdk.Effect('/assets/effects/Makeup_new_morphs.zip');
            await this.player.applyEffect(this.effect);

            this.isInitialized = true;
            return { Dom: sdk.Dom, player: this.player };

        } catch (error) {
            this.initPromise = null; // Reset promise on error
            console.error('Failed to initialize Banuba:', error);
            throw error;
        }
    }

    // Optimized color conversion with memoization
    #colorCache = new Map();
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

    // Optimized parameter setting with validation
    async setParam(key, value) {
        if (!this.effect || !this.isInitialized) {
            await this.initialize();
        }

        const category = CONFIG.CATEGORY_MAPPING[key];
        if (!category) return;

        const formattedValue = key === 'care'
            ? (value || '0.0')
            : this.convertColorToNormalized(value) || '0 0 0 0';

        // Batch multiple parameter updates using requestAnimationFrame
        requestAnimationFrame(() => {
            this.effect.evalJs(`${category}("${formattedValue}")`);
        });
    }

    // Optimized clear method with batched updates
    clear() {
        if (!this.effect) return;

        // Batch all clear operations into a single frame
        requestAnimationFrame(() => {
            Object.entries(CONFIG.CATEGORY_MAPPING).forEach(([key, category]) => {
                const formattedValue = key === 'care' ? '0.0' : '0 0 0 0';
                this.effect.evalJs(`${category}("${formattedValue}")`);
            });
        });
    }

    // Add cleanup method
    destroy() {
        if (this.player) {
            this.player.destroy();
        }
        this.player = null;
        this.effect = null;
        this.isInitialized = false;
        this.moduleCache.clear();
        this.#colorCache.clear();
        this.initPromise = null;
    }
}

export default new BanubaService();