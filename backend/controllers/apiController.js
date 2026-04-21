const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const Customer = require('../models/Customer');
const Restaurant = require('../models/Restaurant');
const Menu = require('../models/MenuItem');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Payment = require('../models/Payment');

// ================= LOGIN =================
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Customer.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        let isMatch = false;

        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch {
            isMatch = false;
        }

        // fallback for plain password (your dataset uses plain text)
        if (!isMatch) {
            isMatch = (password === user.password);
        }

        if (isMatch) {
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                user
            });
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= RESTAURANTS =================
exports.getRestaurants = async (req, res) => {
    try {
        const data = await Restaurant.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addRestaurant = async (req, res) => {
    try {
        const data = await Restaurant.create(req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= MENU =================
exports.getMenu = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;

        const mongoose = require('mongoose');

        console.log("Incoming restaurantId:", restaurantId);

        if (!restaurantId || restaurantId === 'undefined') {
            return res.status(400).json({ error: "restaurantId is required" });
        }

        let query;
        if (mongoose.Types.ObjectId.isValid(restaurantId)) {
            query = {
                $or: [
                    { restaurant_id: restaurantId },
                    { restaurant_id: new mongoose.Types.ObjectId(restaurantId) }
                ]
            };
        } else {
            query = { restaurant_id: restaurantId };
        }

        const data = await Menu.find(query);

        console.log("Menu found:", data.length);
        res.json(data);
    } catch (error) {
        console.error("MENU ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.addMenuItem = async (req, res) => {
    try {
        const data = await Menu.create(req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= CUSTOMERS =================
exports.getCustomers = async (req, res) => {
    try {
        const data = await Customer.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addCustomer = async (req, res) => {
    try {
        const data = await Customer.create(req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= ORDERS =================
exports.getOrders = async (req, res) => {
    try {
        const data = await Order.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const data = await Order.create(req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= ORDER DETAILS =================
exports.addOrderDetails = async (req, res) => {
    res.json({ message: "Use embedded items inside Order in MongoDB" });
};

// ================= DELIVERY =================
exports.assignDelivery = async (req, res) => {
    try {
        const { order_id, deliverypartner_id } = req.body;

        await Order.findByIdAndUpdate(order_id, {
            order_status: "Out for Delivery",
            deliverypartner_id
        });

        res.json({ message: "Delivery assigned" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= PAYMENT =================
exports.processPayment = async (req, res) => {
    try {
        const { order_id, amount, payment_method } = req.body;

        await Payment.create({
            order_id,
            amount,
            payment_method,
            payment_status: "Completed"
        });

        res.json({ message: "Payment done" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= REVIEWS =================
exports.getReviews = async (req, res) => {
    try {
        const data = await Review.find({
            $or: [
                { restaurant_id: req.params.restaurantId },
                { restaurant_id: Number(req.params.restaurantId) }
            ]
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const data = await Review.create(req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};