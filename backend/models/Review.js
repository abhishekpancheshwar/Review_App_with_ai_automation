const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    sentiment: {
        type: String,
        enum: ['Positive', 'Neutral', 'Negative', null],
        default: null, // Initially empty, filled by n8n
    },
    topics: {
        type: [String], 
        default: [], 
    },
    adminReply: {
    text: { type: String },
    createdAt: { type: Date }
    },
}, { timestamps: true });


module.exports = mongoose.model('Review', reviewSchema);