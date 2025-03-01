const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require('crypto');

const path = require("path");
const fs = require("fs");
const multer = require("multer");
const uploadsPath = "/usr/src/app/uploads"; //Folder with downloadable files. Путь к volume (в Docker-контейнере)

const app = express();
app.use(cors({
    exposedHeaders: ['Content-Range']
}));
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI || "mongodb://admin:GevPass12@mongo:27017/loves-db?authSource=admin";

// Подключение к MongoDB
mongoose.connect(mongoUri, {
});

//Удаление изображения из Volume
const deleteImage = (imageUrl) => {
    if (!imageUrl) return;

    // Получаем имя файла из URL (http://localhost:8000/uploads/filename.png -> filename.png)
    const filename = imageUrl.split("/uploads/")[1];
    if (!filename) return;

    const filePath = path.join(uploadsPath, filename); // Формируем полный путь

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
            fs.unlink(filePath, (err) => {
                if (err) console.error(`❌ Ошибка удаления файла ${filePath}:`, err);
                else console.log(`Файл удалён: ${filePath}`);
            });
        } else {
            console.log(`🚨 Файл не найден: ${filePath}, возможно, уже удалён.`);
        }
    });
};

// Модель для товаров
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    description: { type: String },
    category: { type: String, required: true }, // Category as a simple string field
    colors: { type: [String], default: [] },   // Array of color hex codes
    short_description: { type: String },  // Added short description field
    contains: { type: String },           // Added contains field
    using: { type: String },             // Added using field
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Add a virtual field to map `_id` to `id`
productSchema.virtual("id").get(function () {
    return this._id.toString();
});

// Ensure virtuals are included when converting documents to JSON
productSchema.set("toJSON", {
    virtuals: true,
});

const Product = mongoose.model("Product", productSchema);

// Модель для заказов
const orderSchema = new mongoose.Schema({
    userId: String,
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number
    }],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'cancelled'],
        default: 'pending'
    },
    paymentToken: String,
    paymentUrl: String,
    paymentId: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
orderSchema.index({ userId: 1 });

orderSchema.virtual("id").get(function () {
    return this._id.toString();
});

// Ensure virtuals are included when converting documents to JSON
orderSchema.set("toJSON", {
    virtuals: true,
});

const Order = mongoose.model("Order", orderSchema);

const userSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    isOnboarded: { type: Boolean, default: false },
    checkCare: { type: Boolean, default: false },
    checkDecorate: { type: Boolean, default: false },
    checkAccessories: { type: Boolean, default: false },
    checkWeight: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    photo: {
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    },
    referrals: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }],
    reward: {
        type: {
            type: String,
            default: ''
        },
        value: {
            type: Number,
            default: 0
        },
        claimed: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    selectedRewards: { type: [String], default: [] },
})
userSchema.index({ 'referrals.userId': 1 });
const User = mongoose.model("User", userSchema);

userSchema.virtual("id").get(function () {
    return this._id.toString();
});

// Ensure virtuals are included when converting documents to JSON
userSchema.set("toJSON", {
    virtuals: true,
});

const setSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        value: { type: String, required: true }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Add a virtual field to map `_id` to `id`
setSchema.virtual("id").get(function () {
    return this._id.toString();
});

// Ensure virtuals are included when converting documents to JSON
setSchema.set("toJSON", {
    virtuals: true,
});

// Create the Set model
const Set = mongoose.model("Set", setSchema);

const shareLinkSchema = new mongoose.Schema({
    hash: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    selectedProducts: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        value: String
    }],
    createdAt: { type: Date, default: Date.now },
});

const ShareLink = mongoose.model('ShareLink', shareLinkSchema);

// Generate unique hash
function generateHash(length = 8) {
    return crypto.randomBytes(length).toString('hex');
}

// Create the Level model
const levelSchema = new mongoose.Schema({
    level: { type: Number, required: true, unique: true },
    referrals: { type: Number, required: true },
    rewards: {
        permanent: { type: Number, default: 0 },
        oneTime: { type: Number, default: 0 },
        cashback: { type: Number, default: 0 },
    }
}, {
    timestamps: true, // Добавление createdAt и updatedAt
});

// Индекс для ускорения поиска по referrals
levelSchema.index({ referrals: 1 });

// Виртуальное свойство для id
levelSchema.virtual("id").get(function () {
    return this._id.toString();
});

// Учет виртуальных свойств при преобразовании в JSON
levelSchema.set("toJSON", { virtuals: true });

const Level = mongoose.model("Level", levelSchema);

app.get("/api/:userId/level", async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch all levels from the database, sorted by level
        const levels = await Level.find().sort({ level: 1 });

        // Find the user's level based on the number of referrals
        const userReferralCount = user.referrals.length;
        const userLevel = levels.find(level => userReferralCount >= level.referrals);

        // If the user has no level, we still return a 200 status but with empty values
        if (!userLevel) {
            return res.status(200).json({
                level: 0,
                rewards: {},
                nextLevelData: levels[0],
                isRewardsSelected: true
            });
        }

        // Get the next level data (if available)
        const nextLevelData = (userLevel.level < levels[levels.length - 1].level)
            ? levels.find(level => level.level === userLevel.level + 1)
            : null;

        // Check if the user has selected the correct number of rewards for the level
        const selectedRewardsCount = user.selectedRewards.length;

        // Determine if the user has already selected rewards for this level
        const isRewardsSelected = selectedRewardsCount >= userLevel.level;

        // Respond with the level and whether rewards are selected
        res.status(200).json({
            level: userLevel.level,
            rewards: userLevel.rewards,
            nextLevelData,
            isRewardsSelected: isRewardsSelected
        });

    } catch (error) {
        console.error("Error calculating level and checking rewards:", error);
        res.status(500).json({ error: "Failed to calculate level and check rewards" });
    }
});

app.get('/api/:userId/cashback', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.reward.type !== 'cashback') {
            return res.json({ cashback: 0 }); // Return 0 if not cashback
        }

        const orders = await Order.aggregate([
            { $match: { userId: userId, status: 'paid' } }, // Only consider paid orders
            { $group: { _id: null, totalAmount: { $sum: "$total" } } }
        ]);

        let cashbackAmount = 0;
        if (orders.length > 0) {
            const totalSpent = orders[0].totalAmount; // Get total amount spent by the user
            cashbackAmount = (user.reward.value / 100) * totalSpent; // Assuming reward.value is a percentage
        }

        res.json({ cashback: cashbackAmount });

    } catch (error) {
        console.error("Error calculating cashback:", error);
        res.status(500).json({ error: "Failed to calculate cashback" });
    }
});

app.post("/api/users/:userId/select-reward", async (req, res) => {
    const { userId } = req.params;
    const { rewardType, rewardValue } = req.body;

    if (!rewardType || typeof rewardValue !== "number") {
        return res.status(400).json({ error: "Invalid reward data. Provide rewardType and rewardValue." });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update the reward field
        user.reward = {
            type: rewardType,
            value: rewardValue,
        };
        user.selectedRewards.push(rewardType);

        await user.save();

        res.json({
            user: user,
        });
    } catch (error) {
        console.error("Error selecting reward:", error);
        res.status(500).json({ error: "Failed to select reward" });
    }
});

app.post("/api/share-links", async (req, res) => {
    const { userId, selectedProducts } = req.body;

    try {
        // Generate unique hash
        let hash;
        let isUnique = false;
        while (!isUnique) {
            hash = generateHash();
            const existing = await ShareLink.findOne({ hash });
            if (!existing) isUnique = true;
        }

        const shareLink = new ShareLink({
            hash,
            userId,
            selectedProducts,
        });

        await shareLink.save();

        // Generate Telegram deep link
        const telegramLink = `https://t.me/Loves_ai_for_you_bot/LoVeS?startapp=${hash}`;

        res.json({
            hash,
            telegramLink,
        });
    } catch (error) {
        console.error("Error creating share link:", error);
        res.status(500).json({ error: "Failed to create share link" });
    }
});

// Resolve share link endpoint
app.get("/api/share-links/:hash", async (req, res) => {
    const { hash } = req.params;

    try {
        const shareLink = await ShareLink.findOne({
            hash,
        }).populate('userId');

        if (!shareLink) {
            return res.status(404).json({ error: "Share link not found or expired" });
        }

        res.json({
            referrerId: shareLink.userId._id,
            selectedProducts: shareLink.selectedProducts
        });
    } catch (error) {
        console.error("Error resolving share link:", error);
        res.status(500).json({ error: "Failed to resolve share link" });
    }
});

// Create a new Set
app.post("/api/sets", async (req, res) => {
    const { userId, products } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const newSet = new Set({ userId, products });
        await newSet.save();
        res.status(201).json(newSet);
    } catch (error) {
        console.error("Error creating Set:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all Sets
app.get("/api/sets", async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const sets = await Set.find({ userId }); // Populate product details
        res.json(sets);
    } catch (error) {
        console.error("Error retrieving Sets:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a specific Set by ID
app.get("/api/sets/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const set = await Set.findById(id).populate("products.productId");
        if (set) {
            res.json(set);
        } else {
            res.status(404).json({ error: "Set not found" });
        }
    } catch (error) {
        console.error("Error retrieving Set:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update a Set by ID
app.put("/api/sets/:id", async (req, res) => {
    const { id } = req.params;
    const { products } = req.body;

    try {
        const updatedSet = await Set.findByIdAndUpdate(
            id,
            { products, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate("products.productId");

        if (updatedSet) {
            res.json(updatedSet);
        } else {
            res.status(404).json({ error: "Set not found" });
        }
    } catch (error) {
        console.error("Error updating Set:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete a Set by ID
app.delete("/api/sets/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSet = await Set.findByIdAndDelete(id);
        if (deletedSet) {
            res.json({ id });
        } else {
            res.status(404).json({ error: "Set not found" });
        }
    } catch (error) {
        console.error("Error deleting Set:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Эндпоинт для получения всех товаров
app.get("/api/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post("/api/users", async (req, res) => {
    const { telegramId, firstName, lastName, username, linkHash } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ telegramId });

        if (!user) {
            // Create new user
            user = new User({
                telegramId,
                firstName,
                lastName,
                username,
            });
            await user.save();

            // Update referrer's referrals array if referral exists
            if (linkHash) {
                const shareLink = await ShareLink.findOne({
                    hash: linkHash,
                });

                if (shareLink) {
                    await User.findByIdAndUpdate(shareLink.userId, {
                        $push: {
                            referrals: {
                                userId: user._id,
                                createdAt: new Date()
                            }
                        }
                    });
                }
            }
        }

        res.json(user);
    } catch (error) {
        console.error("Error in /users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.patch('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { isOnboarded, checkAccessories, checkCare, checkDecorate, checkWeight, photo } = req.body;

    try {
        let updates = { isOnboarded, checkAccessories, checkCare, checkDecorate, checkWeight };

        // ✅ Only update photo if it exists in request
        if (photo?.url === "") {
            updates["photo.url"] = null;
            updates["photo.uploadedAt"] = null;
        } else if (photo?.url) {
            updates["photo.url"] = photo.url;
            updates["photo.uploadedAt"] = photo.uploadedAt || new Date();
        }
        Object.keys(updates).forEach(key =>
            updates[key] === undefined && delete updates[key]
        );
        const user = await User.findByIdAndUpdate(
            id,
            { $set: updates },
            {
                new: true,           // Return updated document
                runValidators: true  // Run model validators
            }
        );

        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get("/api/users/:userId/referrals", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('referrals.userId', 'firstName lastName username');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user.referrals);
    } catch (error) {
        console.error("Error fetching referrals:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Эндпоинт для создания заказа
app.post("/api/orders", async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
});

// app.post("/api/payment", (req, res) => {
//     const { orderId, total } = req.body;
//     const url = `https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=your_merchant&OutSum=${total}&InvId=${orderId}&SignatureValue=your_signature`;
//     res.json({ url });
// });

app.get("/api/admin/products/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

app.post("/api/admin/products", async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

app.put("/api/admin/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Продукт не найден" });
        }

        const oldImage = product.image; // Сохраненное изображение
        const newImage = req.body.image; // Новое изображение (если есть в запросе)

        // Проверяем, изменилось ли изображение (оно должно существовать и быть другим)
        if (newImage && oldImage && newImage !== oldImage) {
            deleteImage(oldImage);
        }

        // Обновляем только переданные поля, не трогаем `image`, если его нет в `req.body`
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // Обновляем только переданные поля
            { new: true, runValidators: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        console.error("Ошибка обновления продукта:", error);
        res.status(500).json({ error: "Ошибка обновления продукта" });
    }
});




app.delete("/api/admin/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Продукт не найден" });
        }

        // Удаляем изображение из volume
        if (product.image) {
            deleteImage(product.image);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ id: req.params.id, message: "Продукт удален" });

    } catch (error) {
        console.error("Ошибка удаления продукта:", error);
        res.status(500).json({ error: "Ошибка удаления продукта" });
    }
});



// Users endpoints
const handleAdminRoute = (Model, resourceName) => async (req, res) => {
    try {
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
        const [start, end] = req.query.range ? JSON.parse(req.query.range) : [0, 9];
        const [sortField, sortOrder] = req.query.sort ? JSON.parse(req.query.sort) : ["id", "ASC"];
        const total = await Model.countDocuments(filter);
        const items = await Model.find(filter)
            .sort({ [sortField]: sortOrder === "ASC" ? 1 : -1 })
            .skip(start)
            .limit(end - start + 1);

        res.set('Content-Range', `${resourceName} ${start}-${Math.min(end, total)}/${total}`);
        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Levels enpoints
app.get("/api/admin/levels/:id", async (req, res) => {
    try {
        const level = await Level.findById(req.params.id);
        if (!level) {
            return res.status(404).json({ error: "Level not found" });
        }
        res.json(level);
    } catch (error) {
        console.error("Error fetching level:", error);
        res.status(500).json({ error: "Failed to fetch level" });
    }
});

// Create a new level
app.post("/api/admin/levels", async (req, res) => {
    try {
        const level = new Level(req.body);
        await level.save();
        res.status(201).json(level);
    } catch (error) {
        console.error("Error creating level:", error);
        res.status(500).json({ error: "Failed to create level" });
    }
});

// Update the level by ID
app.put("/api/admin/levels/:id", async (req, res) => {
    try {
        const level = await Level.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!level) {
            return res.status(404).json({ error: "Level not found" });
        }
        res.json(level);
    } catch (error) {
        console.error("Error updating level:", error);
        res.status(500).json({ error: "Failed to update level" });
    }
});

// Delete a level by ID
app.delete("/api/admin/levels/:id", async (req, res) => {
    try {
        const level = await Level.findByIdAndDelete(req.params.id);
        if (!level) {
            return res.status(404).json({ error: "Level not found" });
        }
        res.json({ id: req.params.id });
    } catch (error) {
        console.error("Error deleting level:", error);
        res.status(500).json({ error: "Failed to delete level" });
    }
});

app.get("/api/admin/products", handleAdminRoute(Product, "products"));
app.get("/api/admin/users", handleAdminRoute(User, "users"));
app.get("/api/admin/orders", handleAdminRoute(Order, "orders"));
app.get("/api/admin/levels", handleAdminRoute(Level, "levels"));

app.get("/api/admin/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

app.put("/api/admin/users/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
});

app.delete("/api/admin/users/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id });
});

// Запуск сервера
app.listen(8000, () => {
    console.log("Backend running on http://localhost:8000");
});


const PAYKEEPER_CONFIG = {
    baseUrl: 'https://new-vimflat.server.paykeeper.ru',
    login: 'admin',
    password: 'cb9a9c4ae771',
    webhookSecret: 'tEeFZ.MMaVaZET7crc'
};

// Create Basic Auth token
const authToken = Buffer.from(
    `${PAYKEEPER_CONFIG.login}:${PAYKEEPER_CONFIG.password}`
).toString('base64');

// Initialize payment
app.post('/api/create-payment', async (req, res) => {
    try {
        const { userId, items, total } = req.body;
        console.log("Received payment request:", { userId, items, total });

        // Create order first
        const newOrder = new Order({
            userId,
            items,
            total,
            status: 'pending'
        });
        const savedOrder = await newOrder.save();

        console.log("Order saved:", savedOrder);
        // Step 1: Get security token
        // const tokenResponse = await fetch(`${PAYKEEPER_CONFIG.baseUrl}/info/settings/token/`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Authorization': `Basic ${authToken}`
        //     },
        //     signal: AbortSignal.timeout(60 * 1000),
        // });

        // if (!tokenResponse.ok) {
        //     throw new Error(`Failed to get security token: ${tokenResponse.statusText}`);
        // }

        // const tokenData = await tokenResponse.json();
        // if (!tokenData.token) {
        //     throw new Error('Security token not received');
        // }

        // // Prepare payment data with security token
        // const paymentData = {
        //     pay_amount: total,
        //     clientid: userId || 'guest@example.com',
        //     orderid: savedOrder._id.toString(),
        //     token: tokenData.token // Add the security token to the payment data
        // };

        // console.log("Payment data prepared:", paymentData);

        // // Step 2: Create invoice
        // const invoiceResponse = await fetch(`${PAYKEEPER_CONFIG.baseUrl}/change/invoice/preview/`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Authorization': `Basic ${authToken}`
        //     },
        //     signal: AbortSignal.timeout(60 * 1000),
        //     body: new URLSearchParams(paymentData).toString()
        // });

        // if (!invoiceResponse.ok) {
        //     throw new Error(`Failed to create invoice: ${invoiceResponse.statusText}`);
        // }

        // const invoiceData = await invoiceResponse.json();

        // if (!invoiceData.invoice_id) {
        //     throw new Error('Invoice ID not received');
        // }

        // // Generate payment URL
        // const paymentUrl = `${PAYKEEPER_CONFIG.baseUrl}/bill/${invoiceData.invoice_id}/`;

        const response = await fetch('http://89.104.69.75:5000/api/paykeeper', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                total,
                orderId: savedOrder._id.toString()
            })
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        if (data.success) {
            console.log(data);
            savedOrder.paymentId = data.invoice_id;
            savedOrder.paymentUrl = data.paymentUrl;
            await savedOrder.save();

            res.json({
                success: true,
                order: savedOrder,
                paymentUrl: data.paymentUrl
            });
        } else {
            throw new Error("Payment request failed");
        }
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({
            error: "Failed to create payment",
            message: error.message
        });
    }
});

// Updated webhook handler to update order status
app.post('/api/payment', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-paykeeper-signature'];
    const payload = req.body;
    console.log("Payment status updated:", payload);
    const calculatedSignature = crypto
        .createHmac('sha256', PAYKEEPER_CONFIG.webhookSecret)
        .update(payload)
        .digest('hex');
    console.log("Crypro init", calculatedSignature);
    if (crypto.timingSafeEqual(
        Buffer.from(calculatedSignature),
        Buffer.from(signature)
    )) {
        try {
            const webhookData = JSON.parse(payload);
            const orderId = webhookData.orderid;

            // Update order status based on payment result
            const order = await Order.findById(orderId);
            if (order) {
                order.status = webhookData.status === 'paid' ? 'paid' : 'failed';
                order.updatedAt = new Date();
                await order.save();

                console.log(`Order ${orderId} status updated to ${order.status}`);
            }

            res.send('OK');
        } catch (error) {
            console.error('Webhook processing error:', error);
            res.status(500).send('Error processing webhook');
        }
    } else {
        console.log("Invalid signature");
        res.status(400).send('Invalid signature');
    }
});

// Get order status endpoint
app.get('/api/orders/:orderId/status', async (req, res) => {
    try {
        const { orderId } = req.params;

        // Fetch order details from the database
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Ensure PAYKEEPER_CONFIG and authToken are set
        const { baseUrl } = PAYKEEPER_CONFIG;
        if (!authToken) {
            console.error('Authorization token is not defined.');
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Fetch payment status from PayKeeper
        const response = await axios.get(`${baseUrl}/info/payments/byorder/${orderId}/`, {
            headers: { 'Authorization': `Basic ${authToken}` },
        });

        // Respond with order and payment status
        res.json({
            orderId: order._id,
            status: order.status,
            paymentStatus: response.data,
            total: order.total,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        });
    } catch (error) {
        const errorMessage = error.response?.data || error.message || 'Unknown error';
        console.error('Error fetching order status:', errorMessage);

        res.status(500).json({
            error: 'Failed to check order status',
            details: errorMessage,
        });
    }
});


// Distribution of static files======================================

console.log(`Раздача файлов из: ${uploadsPath}`);

// Проверяем файлы при старте сервера
fs.readdir(uploadsPath, (err, files) => {
    if (err) console.error("🚨 Ошибка чтения папки uploads при запуске:", err);
    else console.log("Файлы в uploads при старте сервера:", files);
});

// Middleware для логирования запросов к файлам
app.use((req, res, next) => {
    if (req.url.startsWith("/uploads")) {
        console.log(`Запрос к файлу: ${req.url}`);
        fs.readdir(uploadsPath, (err, files) => {
            if (err) console.error("🚨 Ошибка чтения uploads:", err);
            else console.log("Текущие файлы в uploads:", files);
        });
    }
    next();
});

// Настройка `multer` для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsPath); // Файлы сохраняются в папку uploads (volume)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
});

const upload = multer({ storage });

//  Эндпоинт загрузки изображения
app.post("/api/admin/upload", upload.single("imageFile"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Файл не загружен" });
    }

    // Формируем полный путь, используя базовый URL
    const baseUrl = process.env.BASE_URL || "http://localhost:8000"; 
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    console.log(`✅ Файл загружен: ${req.file.filename}, доступен по URL: ${fileUrl}`);
    
    res.json({ url: fileUrl });
});


// 📂 Раздаем файлы
app.use("/uploads", express.static(uploadsPath));