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
        this.imageCapture = null;
        this.isInitialized = false;
        this.dbName = "BanubaCacheDB";
        this.storeName = "BanubaModules";
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

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (error) => {
                reject(error);
            };
        });
    }

    async saveToDB(key, value) {
        const db = await this.initDB();
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        store.put(value, key);
    }

    async getFromDB(key) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (error) => reject(error);
        });
    }

    async cacheSDKFiles() {
        const sdkUrl = `https://cdn.jsdelivr.net/npm/@banuba/webar@${SDK_VERSION}/dist/BanubaSDK.browser.esm.min.js`;

        try {
            const response = await fetch(sdkUrl);
            if (response.ok) {
                const jsText = await response.text(); // Read JS as text
                await this.saveToDB(sdkUrl, jsText); // Store as text
                console.log(`Cached SDK as text`);
            }
        } catch (error) {
            console.error("Failed to cache SDK:", error);
        }
    }

    async loadSDKFromCache() {
        const sdkUrl = `https://cdn.jsdelivr.net/npm/@banuba/webar@${SDK_VERSION}/dist/BanubaSDK.browser.esm.min.js`;

        try {
            const jsText = await this.getFromDB(sdkUrl);
            if (jsText) {
                const sdkModule = eval(jsText); // Execute JavaScript directly
                return sdkModule;
            }
            return null;
        } catch (error) {
            console.error("Failed to load SDK from cache:", error);
            return null;
        }
    }

    async initialize() {
        if (this.isInitialized) return;
        try {
            // let sdkModules = await this.loadSDKFromCache();
            let sdkModules = [];
            if (!false) {
                sdkModules = await eval(
                    `import('https://cdn.jsdelivr.net/npm/@banuba/webar@${SDK_VERSION}/dist/BanubaSDK.browser.esm.min.js')`
                );
                await this.cacheSDKFiles();
            }

            const { Dom, Player, Module, Effect, Webcam, ImageCapture } = sdkModules;
            
            this.player = await Player.create({
                clientToken: BANUBA_CLIENT_TOKEN,
                locateFile: `https://cdn.jsdelivr.net/npm/@banuba/webar@${SDK_VERSION}/dist`
            });

            this.imageCapture = new ImageCapture(this.player);

            await Promise.all(
                modulesList.map(async (moduleId) => {
                    try {
                        const moduleUrl = `https://cdn.jsdelivr.net/npm/@banuba/webar@${SDK_VERSION}/dist/modules/${moduleId}.zip`;
                        let moduleBlob = await this.getFromDB(moduleUrl);
                        if (!moduleBlob) {
                            const response = await fetch(moduleUrl);
                            moduleBlob = await response.blob();
                            await this.saveToDB(moduleUrl, moduleBlob);
                        }
                        const module = await Module.preload(moduleBlob);
                        await this.player.addModule(module);
                    } catch (error) {
                        console.warn(`Load module ${moduleId} error: `, error);
                    }
                })
            );

            const webcam = new Webcam({
                width: {
                    min: 640,
                    ideal: 640,
                    max: 640
                },
                height: {
                    min: 480,
                    ideal: 480,
                    max: 480
                }
            });
            this.player.use(webcam);
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

    /**
     * Captures a photo from the current Banuba player frame (with the effect applied).
     * @return {Promise<string>} - A Promise that resolves with a data URL of the image.
     */
    async takePhoto() {
        if (!this.isInitialized) {
            throw new Error('Banuba not initialized');
        }
        try {
            const photoSettings = {
                width: 640, // Adjust for optimal size (1024+ for high quality)
                height: 480, // Keep aspect ratio
                quality: 0.7, // 85% quality (good balance)
                // type: "image/webp" // WEBP is the most efficient format
            };
            // ImageCapture.takePhoto() returns a Blob in newer browsers
            const photoBlob = await this.imageCapture.takePhoto(photoSettings);

            // Convert Blob to base64 data URL
            // const base64DataUrl = await this.blobToBase64(photoBlob);

            // base64DataUrl looks like "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
            return photoBlob;
        } catch (error) {
            console.error('Failed to capture photo:', error);
            throw error;
        }
    }

    /**
 * Helper function to convert a Blob to a base64 data URL string.
 * @param {Blob} blob
 * @return {Promise<string>} - A Promise that resolves to a data URL (base64) string
 */
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                // reader.result is something like: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
                resolve(reader.result);
            };

            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
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
