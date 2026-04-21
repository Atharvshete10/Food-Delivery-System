const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Customer = require('../models/Customer'); // ✅ FIXED

// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, street, city, state, pincode } = req.body;

        // Check if user exists
        const existingUser = await Customer.findOne({ email }); // ✅ FIXED
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await Customer.create({
            name,
            email,
            phone,
            password: hashedPassword,
            street,
            city,
            state,
            pincode
        });

        res.status(201).json({
            message: 'User registered successfully',
            customer_id: user._id   // ✅ FIXED
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed. Please try again later.' });
    }
};

// LOGIN
exports.login = async (req, res) => {
    console.log('--- LOGIN ATTEMPT (userController) ---');
    console.log('Body:', req.body);

    try {
        const { email, password } = req.body;

        // Find user
        const user = await Customer.findOne({ email }); // ✅ FIXED

        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ error: 'Invalid credentials: User not found' });
        }

        // Check password
        let isMatch = false;

        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch {
            isMatch = false;
        }

        if (!isMatch) {
            isMatch = (password === user.password);
        }

        if (!isMatch) {
            console.log('Password mismatch for:', email);
            return res.status(400).json({ error: 'Invalid credentials: Password mismatch' });
        }

        console.log('Login successful for:', email);

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },   // ✅ FIXED
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,   // ✅ FIXED
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again later.' });
    }
};

// PROFILE
exports.getProfile = async (req, res) => {
    try {
        const user = await Customer.findById(req.user.id); // ✅ FIXED

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};