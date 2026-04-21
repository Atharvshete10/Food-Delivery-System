const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    restaurant_id: mongoose.Schema.Types.Mixed,
    name: String,
    address: String,
    contact_no: String,
    contacts: [String]
}, { strict: false });

module.exports = mongoose.model('Restaurant', restaurantSchema);