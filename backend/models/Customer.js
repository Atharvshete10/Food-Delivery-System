const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String
}, { strict: false });

module.exports = mongoose.model('Customer', customerSchema);