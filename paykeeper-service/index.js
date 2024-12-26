const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

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

// Fetch the security token
async function getSecurityToken() {
    const response = await fetch(`${PAYKEEPER_CONFIG.baseUrl}/info/settings/token/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authToken}`
        },
        signal: AbortSignal.timeout(60 * 1000),
    });

    if (!response.ok) {
        throw new Error(`Failed to get security token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
}

// Create an invoice
async function createInvoice(paymentData) {
    const response = await fetch(`${PAYKEEPER_CONFIG.baseUrl}/change/invoice/preview/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authToken}`
        },
        signal: AbortSignal.timeout(60 * 1000),
        body: new URLSearchParams(paymentData).toString()
    });

    if (!response.ok) {
        throw new Error(`Failed to create invoice: ${response.statusText}`);
    }

    const invoiceData = await response.json();
    return invoiceData;
}

// API endpoint to create payment
app.post('/api/paykeeper', async (req, res) => {
    try {
        const { userId, total, orderId } = req.body;
        console.log("Received payment request:", { userId, total });

        // Step 1: Get security token
        const token = await getSecurityToken();
        console.log("Security token received:", token);

        // Prepare payment data with security token
        const paymentData = {
            pay_amount: total,
            clientid: userId || 'guest@example.com',
            orderid: orderId,
            token: token
        };

        console.log("Payment data prepared:", paymentData);

        // Step 2: Create invoice
        const invoiceData = await createInvoice(paymentData);

        if (!invoiceData.invoice_id) {
            throw new Error('Invoice ID not received');
        }

        // Generate payment URL
        const paymentUrl = `${PAYKEEPER_CONFIG.baseUrl}/bill/${invoiceData.invoice_id}/`;

        res.json({
            success: true,
            paymentUrl: paymentUrl,
            invoice_id: invoiceData.invoice_id
        });
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({
            error: "Failed to create payment",
            message: error.message
        });
    }
});

// Start the service on the host network
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`External PayKeeper service running on http://localhost:${PORT}`);
});
