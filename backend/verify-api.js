const pool = require('./config/db');
const apiController = require('./controllers/apiController');

async function verifyAPIs() {
    const mockRes = {
        status: function(s) { this.statusCode = s; return this; },
        json: function(data) { this.data = data; return this; }
    };

    try {
        console.log('--- Verifying addRestaurant ---');
        const restaurantReq = {
            body: {
                name: 'Test Pizza' + Date.now(),
                address: '123 Pizza St',
                contact_no: '9988776655'
            }
        };
        await apiController.addRestaurant(restaurantReq, mockRes);
        console.log('Result:', mockRes.data);
        const restaurantId = mockRes.data.restaurant_id;

        console.log('--- Verifying addMenuItem ---');
        const menuReq = {
            body: {
                item_name: 'Margherita',
                price: 250,
                category: 'Veg',
                restaurant_id: restaurantId
            }
        };
        await apiController.addMenuItem(menuReq, mockRes);
        console.log('Result:', mockRes.data);

        console.log('--- Verifying getRestaurants ---');
        await apiController.getRestaurants({}, mockRes);
        const restaurant = mockRes.data.find(r => r.restaurant_id === restaurantId);
        console.log('Found Restaurant with contacts:', restaurant ? restaurant.contacts : 'NOT FOUND');

        console.log('--- Verifying getCustomers ---');
        await apiController.getCustomers({}, mockRes);
        console.log('Customers count:', mockRes.data.length);

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await pool.end();
        process.exit();
    }
}

verifyAPIs();
