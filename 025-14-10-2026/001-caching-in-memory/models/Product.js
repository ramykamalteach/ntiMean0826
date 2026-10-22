const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price must be a positive number']
        },
        category: {
            type: String,
            required: [true, 'Product category is required'],
            trim: true,
            default: 'Electronics'
        },
        stock: {
            type: Number,
            default: 15,
            min: [0, 'Stock cannot be negative']
        },
        description: {
            type: String,
            default: 'High quality product'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);
