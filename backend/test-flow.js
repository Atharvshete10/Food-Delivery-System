const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function testFlow() {
    try {
        const email = 'test' + Date.now() + '@example.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Testing Registration...');
        const userId = await User.create({
            name: 'Test User',
            email: email,
            phone: '1234567890',
            password: hashedPassword,
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
        });
        console.log('User created with ID:', userId);

        console.log('Testing Login...');
        const user = await User.findByEmail(email);
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', isMatch);
            console.log('User data:', user);
        } else {
            console.log('User not found by email!');
        }

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        process.exit();
    }
}

testFlow();
