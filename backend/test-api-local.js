const axios = require('axios');

async function testAPIs() {
    const baseUrl = 'http://localhost:5000/api';
    try {
        console.log('Testing GET /api/restaurants...');
        const restRes = await axios.get(`${baseUrl}/restaurants`);
        console.log('Restaurants:', JSON.stringify(restRes.data, null, 2));

        console.log('\nTesting GET /api/customers...');
        const custRes = await axios.get(`${baseUrl}/customers`);
        console.log('Customers:', JSON.stringify(custRes.data, null, 2));

        if (restRes.data.length > 0) {
            const rId = restRes.data[0].restaurant_id;
            console.log(`\nTesting GET /api/menu/${rId}...`);
            const menuRes = await axios.get(`${baseUrl}/menu/${rId}`);
            console.log('Menu:', JSON.stringify(menuRes.data, null, 2));
        }

    } catch (err) {
        console.error('API Test failed:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        }
    }
}

testAPIs();
