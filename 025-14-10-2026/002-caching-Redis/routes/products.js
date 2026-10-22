// routes/products.js
const express = require('express');
const router = express.Router();
const { redisClient } = require('../config/redis');
const Product = require('../models/Product');

/**
 * GET /api/products
 * Implements the Cache-Aside pattern:
 * 1. Check Redis for cached products
 * 2. If HIT: return cached data immediately
 * 3. If MISS: query MongoDB, cache in Redis with 60s TTL, and return
 */
router.get('/', async (req, res) => {
    const startTime = Date.now();
    try {
        // 1. Check Redis
        const cachedProducts = await redisClient.get('products');
        if (cachedProducts) {
            const responseTime = Date.now() - startTime;
            const ttl = await redisClient.ttl('products');
            return res.json({
                source: 'redis',
                responseTime: `${responseTime}ms`,
                ttl: ttl > 0 ? `${ttl}s` : 'no ttl',
                timestamp: new Date().toISOString(),
                data: JSON.parse(cachedProducts)
            });
        }

        // 2. Query MongoDB
        const products = await Product.find().lean();

        // 3. Store in Redis for 60 seconds (EX: 60)
        await redisClient.set('products', JSON.stringify(products), { EX: 60 });
        const responseTime = Date.now() - startTime;

        res.json({
            source: 'database',
            responseTime: `${responseTime}ms`,
            ttl: '60s',
            timestamp: new Date().toISOString(),
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * Tutorial Helper Endpoints
 */

// Check current cache status & remaining TTL
router.get('/status', async (req, res) => {
    try {
        const cached = await redisClient.get('products');
        const ttl = await redisClient.ttl('products');
        const status = redisClient.getStatus ? redisClient.getStatus() : { mode: 'redis' };
        
        res.json({
            key: 'products',
            isCached: !!cached,
            ttl: ttl,
            ttlFormatted: ttl > 0 ? `${ttl} seconds remaining` : (ttl === -2 ? 'Key expired / does not exist' : 'No expiration'),
            mode: status.mode,
            serverTime: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Clear cache key 'products' (Simulates cache invalidation)
router.delete('/cache', async (req, res) => {
    try {
        await redisClient.del('products');
        res.json({
            success: true,
            message: 'Cache key "products" has been deleted from Redis',
            action: 'DEL products'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new product to MongoDB to show why cache invalidation is needed
router.post('/add', async (req, res) => {
    try {
        const { name, category, price, stock, description } = req.body;
        const newProduct = await Product.create({
            name: name || `New Product ${Date.now() % 1000}`,
            category: category || 'Electronics',
            price: Number(price) || 299.99,
            stock: Number(stock) || 10,
            rating: 5.0,
            description: description || 'Added via interactive tutorial demonstration.'
        });

        res.status(201).json({
            success: true,
            message: 'Product added to MongoDB! Note: Redis cache might still serve stale data until TTL expires or cache is cleared.',
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
