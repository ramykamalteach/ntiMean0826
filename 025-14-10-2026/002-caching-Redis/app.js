// app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectRedis } = require('./config/redis');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve the Interactive Tutorial Web Application
app.use(express.static(path.join(__dirname, 'public')));

// Mount Products Route (supports both /api/products and /products)
app.use('/api/products', productsRouter);
app.use('/products', productsRouter);

// Health / Info endpoint
app.get('/api/info', (req, res) => {
    res.json({
        title: 'Redis Caching Tutorial - NTI MEAN Stack',
        version: '1.0.0',
        routes: {
            products: '/api/products',
            cacheStatus: '/api/products/status',
            clearCache: 'DELETE /api/products/cache',
            addProduct: 'POST /api/products/add'
        }
    });
});

async function startServer() {
    // Connect Redis before listening
    await connectRedis();

    app.listen(PORT, () => {
        console.log('\n======================================================');
        console.log(`🚀 NTI Redis Caching Server is running on port ${PORT}`);
        console.log(`📖 Tutorial Web App: http://localhost:${PORT}`);
        console.log(`📦 Products API:     http://localhost:${PORT}/api/products`);
        console.log(`📊 Cache Status:     http://localhost:${PORT}/api/products/status`);
        console.log('======================================================\n');
    });
}

startServer();

module.exports = app;
