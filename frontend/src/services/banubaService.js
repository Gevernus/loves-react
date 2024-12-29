const SDK_VERSION = "1.16.1";
const BANUBA_CLIENT_TOKEN = "Qk5CII+SJ3OALjTWuiTWjn2Fnk/Qb0HFr18ARBIk8fM++UUN5GzuqRrNHUDBAaK2a9bWmgQL7WI03XKYaHVeEP/jrge5fNI1srRe9vHdGAJJ7qU7n60fy1vNVK93YRkicI0LzoEEmueKhvDHi6GTEPJ1ohlUNPBt68CFJd2VGHLx5lHOsN+cmoTfTFGQtwvBwu9TzKebOpY/A67K5jD+jL8s7bOe7Pqm+pWX5Uq/8ihgdSC/uoAkWZjcCc7y63thkV5anenzFlftO6mGXw/GtuFhP3qvA6uGDu+8ye6PbjM70wIcrw7jMaXAV6pjcDNC6SCh86sxLgNTmPUwhuA23p7TG0Mv+gTxp5bCfBWYBUL3i+j+Hz/1vZ4VYglvvIlSvZKTIOdi4BbmHqMyFOiLFE2zOjupJr0zg0aIeyXHw9PFzMU5qlvO+mQe3g3GycTRsSA6+O3ksGA0W3LtBUQwvb+1wIBq0w/ODCJnntUJyORXZpgO1cF1WEQZfleg7AZUybeOiDQ3zw/XJTHqucRTypt7BBRUGv512VKV8V++lOWdGb79cyBnaindIHWDKT2ERwL9bBN2up+ZGSFCkutOzZkKq60xOnLfNKiJVMLmXj1NypUBr2i8wtr4+iOH3tQs7Hu2lZZxhLLKlDbpm70mCkKs";

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