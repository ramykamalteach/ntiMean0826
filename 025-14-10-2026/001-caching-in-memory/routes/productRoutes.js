const express = require('express');
const router = express.Router();
const cache = require('../config/cache');
const Product = require('../models/Product');

// In-memory fallback dataset in case MongoDB is offline
const fallbackProducts = [
    {
        _id: 'mock-1',
        name: 'Sony WH-1000XM5 Wireless Headphones (Fallback)',
        price: 399.99,
        category: 'Audio',
        stock: 25,
        description: 'Industry-leading noise canceling (Loaded from fallback store)'
    },
    {
        _id: 'mock-2',
        name: 'Logitech MX Master 3S Ergonomic Mouse (Fallback)',
        price: 99.99,
        category: 'Peripherals',
        stock: 45,
        description: 'Quiet clicks and 8K DPI track-on-glass sensor'
    },
    {
        _id: 'mock-3',
        name: 'Keychron Q1 Pro Wireless Custom Keyboard (Fallback)',
        price: 199.50,
        category: 'Peripherals',
        stock: 18,
        description: 'Full metal body, hot-swappable switches'
    }
];

// Helper to calculate remaining TTL in seconds
function getRemainingTTL(key) {
    const ttlTimestamp = cache.getTtl(key);
    if (!ttlTimestamp) return 0;
    const remainingMs = ttlTimestamp - Date.now();
    return remainingMs > 0 ? Math.round(remainingMs / 1000) : 0;
}

// -------------------------------------------------------------
// STEP 3: GET all products (with caching + enhancements)
// -------------------------------------------------------------
router.get('/', async (req, res) => {
    const startTime = Date.now();

    try {
        // 1. Check whether products exist in cache
        const cachedProducts = cache.get('products');
        if (cachedProducts) {
            console.log('Data from CACHE');
            const responseTimeMs = Date.now() - startTime;
            const remainingTTL = getRemainingTTL('products');

            return res.json({
                source: 'cache',
                data: cachedProducts,
                count: cachedProducts.length,
                responseTimeMs,
                ttlRemainingSeconds: remainingTTL,
                message: `Loaded ${cachedProducts.length} products directly from memory cache in ${responseTimeMs}ms.`
            });
        }

        // 2. If not cached, query MongoDB (or fallback if DB offline)
        console.log('Data from DATABASE');
        let products;
        let sourceUsed = 'database';

        try {
            products = await Product.find().sort({ createdAt: -1 });
        } catch (dbErr) {
            console.warn(`[Database Warning] Query failed (${dbErr.message}). Using fallback dataset.`);
            products = fallbackProducts;
            sourceUsed = 'database-fallback';
        }

        // 3. Store results in cache for 60 seconds
        cache.set('products', products);

        // 4. Return products with performance metadata
        const responseTimeMs = Date.now() - startTime;
        const remainingTTL = getRemainingTTL('products');

        res.json({
            source: sourceUsed,
            data: products,
            count: products.length,
            responseTimeMs,
            ttlRemainingSeconds: remainingTTL,
            message: `Queried ${products.length} products from ${sourceUsed} in ${responseTimeMs}ms, then cached for 60s.`
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// -------------------------------------------------------------
// ENHANCEMENT 1: Cache Invalidation when creating a product
// (Prevents stale cache bug where newly added products do not show up)
// -------------------------------------------------------------
router.post('/', async (req, res) => {
    try {
        const { name, price, category, stock, description } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name and price are required fields.'
            });
        }

        let newProduct;
        try {
            newProduct = await Product.create({
                name,
                price: Number(price),
                category: category || 'General',
                stock: stock !== undefined ? Number(stock) : 10,
                description: description || ''
            });
        } catch (dbErr) {
            // If MongoDB offline, save into fallback list
            newProduct = {
                _id: 'mock-' + Date.now(),
                name,
                price: Number(price),
                category: category || 'General',
                stock: stock !== undefined ? Number(stock) : 10,
                description: description || '',
                createdAt: new Date()
            };
            fallbackProducts.unshift(newProduct);
        }

        // CRITICAL CACHING STEP: Cache Invalidation
        // Delete the cached 'products' key so next GET request fetches fresh data from DB
        const wasCached = cache.has('products');
        cache.del('products');
        console.log(`[Cache Invalidation] 'products' key was cleared due to new product addition.`);

        res.status(201).json({
            success: true,
            message: 'Product created successfully and cache was invalidated.',
            cacheInvalidated: wasCached,
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// -------------------------------------------------------------
// ENHANCEMENT 2: Cache Invalidation when deleting a product
// -------------------------------------------------------------
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        try {
            await Product.findByIdAndDelete(id);
        } catch (dbErr) {
            const idx = fallbackProducts.findIndex(p => p._id === id);
            if (idx !== -1) fallbackProducts.splice(idx, 1);
        }

        // Invalidate cache
        cache.del('products');
        console.log(`[Cache Invalidation] 'products' key cleared after deleting product ${id}`);

        res.json({
            success: true,
            message: `Product ${id} deleted and cache invalidated.`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// -------------------------------------------------------------
// ENHANCEMENT 3: Cache Management & Statistics endpoint
// -------------------------------------------------------------
router.get('/cache/status', (req, res) => {
    const isCached = cache.has('products');
    const remainingTTL = getRemainingTTL('products');
    const stats = cache.getStats();
    const keys = cache.keys();

    res.json({
        hasProductsCached: isCached,
        ttlRemainingSeconds: remainingTTL,
        standardTTLSeconds: 60,
        allKeys: keys,
        stats: {
            hits: stats.hits,
            misses: stats.misses,
            keysCount: stats.keys,
            ksize: stats.ksize,
            vsize: stats.vsize
        }
    });
});

// -------------------------------------------------------------
// ENHANCEMENT 4: Manual Cache Flush
// -------------------------------------------------------------
router.post('/cache/flush', (req, res) => {
    cache.flushAll();
    console.log('[Cache] Flushed all cache keys.');
    res.json({
        success: true,
        message: 'All cache keys have been flushed successfully.'
    });
});

module.exports = router;
