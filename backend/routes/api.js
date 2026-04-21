const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Restaurant APIs
router.get('/restaurants', apiController.getRestaurants);
router.post('/restaurants', apiController.addRestaurant);
router.delete('/restaurants/:id', apiController.deleteRestaurant);

// Menu APIs
router.get('/menu/:restaurantId', apiController.getMenu);
router.post('/menu', apiController.addMenuItem);

// Customer APIs
router.get('/customers', apiController.getCustomers);
router.post('/customers', apiController.addCustomer);

// Order APIs
router.get('/orders', apiController.getOrders);
router.post('/orders', apiController.createOrder);

// Order Details APIs
router.post('/order-items', apiController.addOrderDetails);

// Delivery APIs
router.post('/delivery', apiController.assignDelivery);

// Payment APIs
router.post('/payments', apiController.processPayment);

// Review APIs
router.get('/reviews/:restaurantId', apiController.getReviews);
router.post('/reviews', apiController.addReview);

// login api
router.post('/login', apiController.login);

module.exports = router;