const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    review_date: {
        type: Date,
        default: Date.now
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }
}, { strict: false });

module.exports = mongoose.model('Review', reviewSchema);