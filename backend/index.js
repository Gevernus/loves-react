const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/loves-db";

// Подключение к MongoDB
mongoose.connect(mongoUri, {
});

// Модель для товаров
const Product = mongoose.model("Product", new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    description: { type: String },
    category: { type: String, required: true },  // Category as a simple string field
    colors: { type: [String], default: [] },  // Array of color hex codes
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}));

// Модель для заказов
const Order = mongoose.model("Order", new mongoose.Schema({
    userId: String,
    items: [{ productId: String, quantity: Number }],
    total: Number,
    createdAt: { type: Date, default: Date.now },
}));

const User = mongoose.model("User", new mongoose.Schema({
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
}));

// Эндпоинт для получения всех товаров
app.get("/api/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post("/api/users", async (req, res) => {
    const { telegramId, firstName, lastName, username } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ telegramId });

        // Create user if not found
        if (!user) {
            user = new User({ telegramId, firstName, lastName, username });
            await user.save();
        }

        res.json(user);
    } catch (error) {
        console.error("Error in /users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.patch('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const updates = {
        isOnboarded,
        checkAccessories,
        checkCare,
        checkDecorate,
        checkWeight
    } = req.body;

    try {
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

// Эндпоинт для создания заказа
app.post("/api/orders", async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
});

app.post("/api/payment", (req, res) => {
    const { orderId, total } = req.body;
    const url = `https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=your_merchant&OutSum=${total}&InvId=${orderId}&SignatureValue=your_signature`;
    res.json({ url });
});

// Запуск сервера
app.listen(8000, () => {
    console.log("Backend running on http://localhost:8000");
});
