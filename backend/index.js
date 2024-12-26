const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require('crypto');

const app = express();
app.use(cors({
    exposedHeaders: ['Content-Range']
}));
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI || "mongodb://admin:GevPass12@mongo:27017/loves-db?authSource=admin";

// Подключение к MongoDB
mongoose.connect(mongoUri, {
});

// Модель для товаров
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    description: { type: String },
    category: { type: String, required: true }, // Category as a simple string field
    colors: { type: [String], default: [] },   // Array of color hex codes
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
})
const User = mongoose.model("User", userSchema);

userSchema.virtual("id").get(function () {
    return this._id.toString();
});

// Ensure virtuals are included when converting documents to JSON
userSchema.set("toJSON", {
    virtuals: true,
});

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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
});

app.delete("/api/admin/products/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id });
});

// Users endpoints
const handleAdminRoute = (Model, resourceName) => async (req, res) => {
    try {
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
        const [start, end] = req.query.range ? JSON.parse(req.query.range) : [0, 9];
        const [sortField, sortOrder] = req.query.sort ? JSON.parse(req.query.sort) : ["id", "ASC"];
        console.log(`Start: ${start}:${req.query.range}`)
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

app.get("/api/admin/products", handleAdminRoute(Product, "products"));
app.get("/api/admin/users", handleAdminRoute(User, "users"));
app.get("/api/admin/orders", handleAdminRoute(Order, "orders"));

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