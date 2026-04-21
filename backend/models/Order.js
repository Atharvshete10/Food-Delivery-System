const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
    },
    quantity: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
    delivery_address: String,
    order_date: {
        type: Date,
        default: Date.now
    },
    order_status: {
        type: String,
        default: 'Pending'
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    deliverypartner_id: {
        type: String,
        default: null
    },
    items: [orderItemSchema]
}, { strict: false });

module.exports = mongoose.model('Order', orderSchema);