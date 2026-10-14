// models/Product.js
// Product Model simulating MongoDB / Mongoose collection

// Default product catalog for the NTI MEAN Stack tutorial
let productDatabase = [
    {
        _id: "670cfa10e3b9a101a1b1c001",
        name: "MacBook Pro 16\" M3 Max",
        category: "Laptops",
        price: 3499.99,
        stock: 14,
        rating: 4.9,
        description: "Liquid Retina XDR display, 36GB unified memory, 1TB SSD storage."
    },
    {
        _id: "670cfa10e3b9a101a1b1c002",
        name: "Sony WH-1000XM5 Wireless Headphones",
        category: "Audio",
        price: 399.99,
        stock: 35,
        rating: 4.8,
        description: "Industry-leading noise cancellation, 30-hour battery life, crystal clear hands-free."
    },
    {
        _id: "670cfa10e3b9a101a1b1c003",
        name: "Samsung Odyssey Neo G9 Gaming Monitor",
        category: "Displays",
        price: 1799.99,
        stock: 8,
        rating: 4.7,
        description: "49-inch dual QHD curved screen, Mini-LED backlight, 240Hz refresh rate."
    },
    {
        _id: "670cfa10e3b9a101a1b1c004",
        name: "Keychron Q1 Pro Mechanical Keyboard",
        category: "Peripherals",
        price: 199.99,
        stock: 52,
        rating: 4.9,
        description: "Custom wireless mechanical keyboard, QMK/VIA programmable, hot-swappable."
    },
    {
        _id: "670cfa10e3b9a101a1b1c005",
        name: "Logitech MX Master 3S Mouse",
        category: "Peripherals",
        price: 99.99,
        stock: 80,
        rating: 4.9,
        description: "Quiet clicks, 8K DPI sensor for glass tracking, ergonomic electromagnetic scroll."
    }
];

/**
 * Simulates Mongoose model Product
 * Supports Product.find().lean() as demonstrated in the lecture
 */
const Product = {
    find: function(filter = {}) {
        return {
            lean: async function() {
                // Simulate realistic MongoDB network/disk query latency (150ms - 220ms)
                await new Promise((resolve) => setTimeout(resolve, 180));
                
                // Return a deep clone of the documents like Mongoose .lean() does (plain JS objects)
                return JSON.parse(JSON.stringify(productDatabase));
            }
        };
    },

    // Helper for tutorial demonstrations (adding a product to test cache staleness/invalidation)
    create: async function(newProduct) {
        await new Promise((resolve) => setTimeout(resolve, 120));
        const item = {
            _id: "670cfa10e3b9a101a1b1c" + (100 + productDatabase.length),
            ...newProduct
        };
        productDatabase.push(item);
        return item;
    },

    // Helper to reset products
    reset: function() {
        // Reset to initial 5 items if modified
        productDatabase = productDatabase.slice(0, 5);
    }
};

module.exports = Product;
