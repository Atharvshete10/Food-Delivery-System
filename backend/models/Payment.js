const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    payment_method: String,
    payment_status: String,
    amount: Number,
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }
}, { strict: false });

module.exports = mongoose.model('Payment', paymentSchema);