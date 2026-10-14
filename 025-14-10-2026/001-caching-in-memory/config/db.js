const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/caching_demo';

const initialProducts = [
    {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        price: 399.99,
        category: 'Audio',
        stock: 25,
        description: 'Industry-leading noise canceling with Auto NC Optimizer and 30-hour battery life.'
    },
    {
        name: 'Logitech MX Master 3S Ergonomic Mouse',
        price: 99.99,
        category: 'Peripherals',
        stock: 45,
        description: 'Quiet clicks and 8K DPI track-on-glass sensor for ultimate precision and comfort.'
    },
    {
        name: 'Keychron Q1 Pro Wireless Custom Keyboard',
        price: 199.50,
        category: 'Peripherals',
        stock: 18,
        description: 'Full metal body, hot-swappable switches, double-gasket design, and QMK/VIA support.'
    },
    {
        name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
        price: 579.00,
        category: 'Displays',
        stock: 12,
        description: 'IPS Black technology with 2000:1 contrast ratio, 98% DCI-P3 color gamut, and 90W PD.'
    },
    {
        name: 'Apple MacBook Air 15" M3 Chip',
        price: 1299.00,
        category: 'Laptops',
        stock: 9,
        description: 'Blazing-fast 8-core CPU, 10-core GPU, 18-hour battery life, and Liquid Retina display.'
    },
    {
        name: 'Anker 737 Power Bank (PowerCore 24K)',
        price: 149.99,
        category: 'Accessories',
        stock: 32,
        description: 'Ultra-powerful two-way charging with 140W fast output and smart digital display.'
    }
];

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`[Database] MongoDB Connected: ${mongoose.connection.host}`);

        // Seed data if database is empty
        const count = await Product.countDocuments();
        if (count === 0) {
            console.log('[Database] Seeding initial sample products...');
            await Product.insertMany(initialProducts);
            console.log(`[Database] Successfully seeded ${initialProducts.length} sample products.`);
        } else {
            console.log(`[Database] Found ${count} existing products in database.`);
        }
    } catch (error) {
        console.error(`[Database Error] Could not connect to MongoDB: ${error.message}`);
        console.warn(`[Database Warning] The application will continue, but database queries may fail if MongoDB is offline.`);
    }
}

module.exports = connectDB;
