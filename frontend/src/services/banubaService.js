const SDK_VERSION = "1.16.1";
const BANUBA_CLIENT_TOKEN = "Qk5CIJGbG6aC0I304LeJkWSCzzeBIU6ojuul2seF8PlOhcZjRMO5Ub2kn95e5+NdrQU7g01AVsNMg7vspCb4y7gS/ymCETZoivri4NKSs4mXhvRz4yQlE1a9sKiJ+OF0xbe6Gumdxy1eePLZXUcuuGD2646GWP3XveG8za/A6ac5XZVrY2iwp+4mz6ZRulDaQTnT9wt+/+ariCRi+xqHYtGhG8PORYIGhoLV7kL04ZS8vyZi3JlXggqVgqC+nhfdEnF/OT3+vhZ3aqNsJyVJ0yRwc1Trz3pdvSenK4jYjNNStmO5UpKjgBuV5VsJpI5hDyqdOKOjq0eJG9z0hCPdXwxCeZXquJtPfcnlxB6Lom+YY9AXcGT0CI234J45rVF7efFlkELyMvYfUYB+/pqt508DXyuvIiccj3NPgaE7OSepC3vk9h9/OMv9t5xEHGkQ4Qtr4bUw9KtEGDLPkKFVJdnkjssO9IcgDD0F30z2Kh3RMhfjXpVlkQBpk1bbrNRs2r7SmhJPPOfXfJqe6CuwAwsMXc8Xonl0dmOMCIHsZEVg7Jdz1U/nyTC2g5N6Y5EFC1ukHi6AZYWKbdJ9fBJznRtmnKeO9juN9/HHpbJ9EkIFsNlGmC53+bCjt6G4Ok5sXQbLudGMvRTgg7hb0BmB7rscNA==";

const modulesList = [
    "face_tracker",
    "lips"
];

class BanubaService {
    constructor() {
        this.player = null;
        this.effect = null;
        this.isInitialized = false;
    }

    async initialize() {
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

            // Initialize camera
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

    setParam(key, value) {
        console.log(`Trying to set param: ${key}:${value}`);
        if (!this.effect || !this.isInitialized) {
            throw new Error('Banuba not initialized');
        }

        const categoryMapping = {
            lips: 'Lips.color',
            brows: 'Brows.color',
            eyeshadow: 'Makeup.eyeshadow',
            eyeliner: 'Makeup.eyeliner',
            hair: 'Hair.color',
            blushes: 'Makeup.blushes',
            lashes: 'Eyelashes.color',
            care: 'Softlight.strength'
        };

        const category = categoryMapping[key];

        if (!category) {
            return;
        }

        // Dynamically execute the JavaScript to set the parameter
        const formattedValue = key === 'softlight' ? value || '0.0' : value || '0 0 0 0';
        this.effect.evalJs(`${category}("${formattedValue}")`);
    }
}

export default new BanubaService();