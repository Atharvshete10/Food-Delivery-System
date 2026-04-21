const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    item_name: String,
    price: Number,
    category: String,
    availability_status: {
        type: Boolean,
        default: true
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);