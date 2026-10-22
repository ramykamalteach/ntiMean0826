const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Register Routes (Step 4)
app.use('/api/products', productRoutes);

// Root route fallback for friendly API health check if accessed via API clients
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        endpoints: {
            getProducts: 'GET /api/products',
            createProduct: 'POST /api/products',
            deleteProduct: 'DELETE /api/products/:id',
            cacheStatus: 'GET /api/products/cache/status',
            cacheFlush: 'POST /api/products/cache/flush'
        }
    });
});

// Centralized error handling
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Cache Demo UI: http://localhost:${PORT}`);
    console.log(`🔌 Products API: http://localhost:${PORT}/api/products`);
    console.log(`===============================================`);
});

module.exports = app;
