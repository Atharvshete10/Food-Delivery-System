const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
    name: String,
    vehicle_number: String,
    phones: [String],
    status: {
        type: String,
        default: "Available"
    }
});

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);