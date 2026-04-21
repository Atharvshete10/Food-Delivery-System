
const mongoose = require('mongoose');
require('dotenv').config();

const Customer = require('./models/Customer');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const Payment = require('./models/Payment');
const Review = require('./models/Review');
const DeliveryPartner = require('./models/DeliveryPartner');

async function initDB() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fooddeliverysystem');

    console.log("MongoDB Connected");

    await mongoose.connection.dropDatabase();
    console.log("Old DB Cleared");

    // Clear DB
    await Promise.all([
        Customer.deleteMany({}),
        Restaurant.deleteMany({}),
        MenuItem.deleteMany({}),
        Order.deleteMany({}),
        Payment.deleteMany({}),
        Review.deleteMany({}),
        DeliveryPartner.deleteMany({})
    ]);

    // =========================
    // RESTAURANTS
    // =========================
    const restaurants = await Restaurant.insertMany([
        { name: "Dominos", address: "Akurdi Pune" },
        { name: "KFC", address: "Nigdi Pune" },
        { name: "McDonalds", address: "Wakad Pune" },
        { name: "Burger King", address: "Baner Pune" },
        { name: "Pizza Hut", address: "Hinjewadi Pune" },
        { name: "Subway", address: "Pimpri Pune" },
        { name: "Biryani House", address: "Chinchwad Pune" },
        { name: "Cafe Coffee Day", address: "Shivajinagar Pune" },
        { name: "Barbeque Nation", address: "Aundh Pune" },
        { name: "Faasos", address: "Pimple Saudagar Pune" }
    ]);
    console.log("Restaurants inserted:", restaurants.length);
    console.log(restaurants);

    // =========================
    // CUSTOMERS
    // =========================
    const customers = await Customer.insertMany([
        { name: "Atharv", email: "atharv@gmail.com", password: "123456" },
        { name: "Rahul", email: "rahul@gmail.com", password: "123456" }
    ]);

    // =========================
    // DELIVERY PARTNERS
    // =========================
    const partners = await DeliveryPartner.insertMany([
        { name: "Ramesh", vehicle_number: "MH12AB1234" },
        { name: "Suresh", vehicle_number: "MH12AB1235" }
    ]);

    // =========================
    // MENU ITEMS (FULL FIXED)
    // =========================
   const menuItems = await MenuItem.insertMany([

/* ================= DOMINOS ================= */
{ item_name: "Margherita Pizza", price:299, category:"Pizza", restaurant_id: restaurants[0]._id },
{ item_name: "Farmhouse Pizza", price:399, category:"Pizza", restaurant_id: restaurants[0]._id },
{ item_name: "Peppy Paneer Pizza", price:429, category:"Pizza", restaurant_id: restaurants[0]._id },
{ item_name: "Veg Extravaganza", price:499, category:"Pizza", restaurant_id: restaurants[0]._id },
{ item_name: "Cheese Burst Pizza", price:459, category:"Pizza", restaurant_id: restaurants[0]._id },
{ item_name: "Garlic Bread", price:129, category:"Sides", restaurant_id: restaurants[0]._id },
{ item_name: "Stuffed Garlic Bread", price:169, category:"Sides", restaurant_id: restaurants[0]._id },
{ item_name: "Paneer Zingy Parcel", price:79, category:"Sides", restaurant_id: restaurants[0]._id },
{ item_name: "Choco Lava Cake", price:99, category:"Dessert", restaurant_id: restaurants[0]._id },
{ item_name: "Coke", price:60, category:"Beverage", restaurant_id: restaurants[0]._id },

/* ================= KFC ================= */
{ item_name: "Chicken Bucket", price:499, category:"Chicken", restaurant_id: restaurants[1]._id },
{ item_name: "Hot Wings", price:249, category:"Chicken", restaurant_id: restaurants[1]._id },
{ item_name: "Zinger Burger", price:199, category:"Burger", restaurant_id: restaurants[1]._id },
{ item_name: "Chicken Popcorn", price:199, category:"Chicken", restaurant_id: restaurants[1]._id },
{ item_name: "Veg Zinger", price:179, category:"Burger", restaurant_id: restaurants[1]._id },
{ item_name: "Chicken Strips", price:229, category:"Chicken", restaurant_id: restaurants[1]._id },
{ item_name: "Krushers Shake", price:149, category:"Beverage", restaurant_id: restaurants[1]._id },
{ item_name: "French Fries", price:119, category:"Sides", restaurant_id: restaurants[1]._id },
{ item_name: "Chocolate Sundae", price:129, category:"Dessert", restaurant_id: restaurants[1]._id },
{ item_name: "Pepsi", price:60, category:"Beverage", restaurant_id: restaurants[1]._id },

/* ================= MCDONALDS ================= */
{ item_name: "McAloo Tikki", price:79, category:"Burger", restaurant_id: restaurants[2]._id },
{ item_name: "McVeggie Burger", price:119, category:"Burger", restaurant_id: restaurants[2]._id },
{ item_name: "McChicken Burger", price:139, category:"Burger", restaurant_id: restaurants[2]._id },
{ item_name: "McSpicy Paneer", price:199, category:"Burger", restaurant_id: restaurants[2]._id },
{ item_name: "McSpicy Chicken", price:209, category:"Burger", restaurant_id: restaurants[2]._id },
{ item_name: "French Fries", price:109, category:"Sides", restaurant_id: restaurants[2]._id },
{ item_name: "Veg Wrap", price:159, category:"Wrap", restaurant_id: restaurants[2]._id },
{ item_name: "Chicken Wrap", price:179, category:"Wrap", restaurant_id: restaurants[2]._id },
{ item_name: "Soft Serve", price:69, category:"Dessert", restaurant_id: restaurants[2]._id },
{ item_name: "Cold Coffee", price:129, category:"Beverage", restaurant_id: restaurants[2]._id },

/* ================= BURGER KING ================= */
{ item_name: "Veg Whopper", price:179, category:"Burger", restaurant_id: restaurants[3]._id },
{ item_name: "Chicken Whopper", price:199, category:"Burger", restaurant_id: restaurants[3]._id },
{ item_name: "Paneer King Melt", price:189, category:"Burger", restaurant_id: restaurants[3]._id },
{ item_name: "Crispy Veg Burger", price:99, category:"Burger", restaurant_id: restaurants[3]._id },
{ item_name: "Chicken Crispy Burger", price:119, category:"Burger", restaurant_id: restaurants[3]._id },
{ item_name: "King Fries", price:119, category:"Sides", restaurant_id: restaurants[3]._id },
{ item_name: "Veg Wrap", price:149, category:"Wrap", restaurant_id: restaurants[3]._id },
{ item_name: "Chicken Wrap", price:169, category:"Wrap", restaurant_id: restaurants[3]._id },
{ item_name: "Chocolate Shake", price:149, category:"Beverage", restaurant_id: restaurants[3]._id },
{ item_name: "Brownie Sundae", price:129, category:"Dessert", restaurant_id: restaurants[3]._id },

/* ================= PIZZA HUT ================= */
{ item_name: "Veggie Lover Pizza", price:399, category:"Pizza", restaurant_id: restaurants[4]._id },
{ item_name: "Paneer Supreme Pizza", price:429, category:"Pizza", restaurant_id: restaurants[4]._id },
{ item_name: "Chicken Supreme Pizza", price:449, category:"Pizza", restaurant_id: restaurants[4]._id },
{ item_name: "Cheese Max Pizza", price:459, category:"Pizza", restaurant_id: restaurants[4]._id },
{ item_name: "Farm Veg Pizza", price:379, category:"Pizza", restaurant_id: restaurants[4]._id },
{ item_name: "Garlic Breadsticks", price:139, category:"Sides", restaurant_id: restaurants[4]._id },
{ item_name: "Potato Wedges", price:129, category:"Sides", restaurant_id: restaurants[4]._id },
{ item_name: "Chicken Wings", price:229, category:"Chicken", restaurant_id: restaurants[4]._id },
{ item_name: "Chocolate Mousse", price:119, category:"Dessert", restaurant_id: restaurants[4]._id },
{ item_name: "Pepsi", price:60, category:"Beverage", restaurant_id: restaurants[4]._id },

/* ================= SUBWAY ================= */
{ item_name: "Veggie Delight Sub", price:179, category:"Sandwich", restaurant_id: restaurants[5]._id },
{ item_name: "Paneer Tikka Sub", price:199, category:"Sandwich", restaurant_id: restaurants[5]._id },
{ item_name: "Aloo Patty Sub", price:159, category:"Sandwich", restaurant_id: restaurants[5]._id },
{ item_name: "Chicken Teriyaki Sub", price:229, category:"Sandwich", restaurant_id: restaurants[5]._id },
{ item_name: "Chicken Tikka Sub", price:219, category:"Sandwich", restaurant_id: restaurants[5]._id },
{ item_name: "Veg Salad", price:149, category:"Salad", restaurant_id: restaurants[5]._id },
{ item_name: "Chicken Salad", price:179, category:"Salad", restaurant_id: restaurants[5]._id },
{ item_name: "Cookies", price:69, category:"Dessert", restaurant_id: restaurants[5]._id },
{ item_name: "Cold Coffee", price:119, category:"Beverage", restaurant_id: restaurants[5]._id },
{ item_name: "Orange Juice", price:99, category:"Beverage", restaurant_id: restaurants[5]._id },

/* ================= BIRYANI HOUSE ================= */
{ item_name: "Chicken Biryani", price:299, category:"Biryani", restaurant_id: restaurants[6]._id },
{ item_name: "Mutton Biryani", price:399, category:"Biryani", restaurant_id: restaurants[6]._id },
{ item_name: "Veg Biryani", price:249, category:"Biryani", restaurant_id: restaurants[6]._id },
{ item_name: "Egg Biryani", price:269, category:"Biryani", restaurant_id: restaurants[6]._id },
{ item_name: "Paneer Biryani", price:279, category:"Biryani", restaurant_id: restaurants[6]._id },
{ item_name: "Chicken Tikka", price:299, category:"Starter", restaurant_id: restaurants[6]._id },
{ item_name: "Mutton Kebab", price:349, category:"Starter", restaurant_id: restaurants[6]._id },
{ item_name: "Raita", price:49, category:"Sides", restaurant_id: restaurants[6]._id },
{ item_name: "Gulab Jamun", price:79, category:"Dessert", restaurant_id: restaurants[6]._id },
{ item_name: "Lassi", price:99, category:"Beverage", restaurant_id: restaurants[6]._id },

/* ================= CCD ================= */
{ item_name: "Espresso", price:119, category:"Coffee", restaurant_id: restaurants[7]._id },
{ item_name: "Cappuccino", price:139, category:"Coffee", restaurant_id: restaurants[7]._id },
{ item_name: "Latte", price:149, category:"Coffee", restaurant_id: restaurants[7]._id },
{ item_name: "Cold Coffee", price:159, category:"Coffee", restaurant_id: restaurants[7]._id },
{ item_name: "Mocha", price:169, category:"Coffee", restaurant_id: restaurants[7]._id },
{ item_name: "Chocolate Brownie", price:119, category:"Dessert", restaurant_id: restaurants[7]._id },
{ item_name: "Veg Sandwich", price:149, category:"Snack", restaurant_id: restaurants[7]._id },
{ item_name: "Paneer Sandwich", price:169, category:"Snack", restaurant_id: restaurants[7]._id },
{ item_name: "Blueberry Muffin", price:129, category:"Dessert", restaurant_id: restaurants[7]._id },
{ item_name: "Iced Tea", price:109, category:"Beverage", restaurant_id: restaurants[7]._id },

/* ================= BBQ NATION ================= */
{ item_name: "Chicken BBQ Platter", price:699, category:"Grill", restaurant_id: restaurants[8]._id },
{ item_name: "Paneer Tikka", price:299, category:"Grill", restaurant_id: restaurants[8]._id },
{ item_name: "Chicken Tikka", price:349, category:"Grill", restaurant_id: restaurants[8]._id },
{ item_name: "Mutton Seekh Kebab", price:399, category:"Grill", restaurant_id: restaurants[8]._id },
{ item_name: "Veg Grill Platter", price:499, category:"Grill", restaurant_id: restaurants[8]._id },
{ item_name: "Chicken Wings", price:299, category:"Starter", restaurant_id: restaurants[8]._id },
{ item_name: "Veg Spring Roll", price:199, category:"Starter", restaurant_id: restaurants[8]._id },
{ item_name: "Butter Naan", price:49, category:"Bread", restaurant_id: restaurants[8]._id },
{ item_name: "Gulab Jamun", price:99, category:"Dessert", restaurant_id: restaurants[8]._id },
{ item_name: "Mango Juice", price:119, category:"Beverage", restaurant_id: restaurants[8]._id },

/* ================= FAASOS ================= */
{ item_name: "Chicken Wrap", price:199, category:"Wrap", restaurant_id: restaurants[9]._id },
{ item_name: "Paneer Wrap", price:179, category:"Wrap", restaurant_id: restaurants[9]._id },
{ item_name: "Veggie Wrap", price:159, category:"Wrap", restaurant_id: restaurants[9]._id },
{ item_name: "Chicken Tikka Wrap", price:219, category:"Wrap", restaurant_id: restaurants[9]._id },
{ item_name: "Cheese Melt Wrap", price:189, category:"Wrap", restaurant_id: restaurants[9]._id },
{ item_name: "Chicken Rice Bowl", price:229, category:"Rice Bowl", restaurant_id: restaurants[9]._id },
{ item_name: "Paneer Rice Bowl", price:199, category:"Rice Bowl", restaurant_id: restaurants[9]._id },
{ item_name: "Veg Rice Bowl", price:179, category:"Rice Bowl", restaurant_id: restaurants[9]._id },
{ item_name: "Chocolate Lava Cake", price:109, category:"Dessert", restaurant_id: restaurants[9]._id },
{ item_name: "Lemonade", price:89, category:"Beverage", restaurant_id: restaurants[9]._id }

]);

    // =========================
    // ORDERS
    // =========================
    const orders = await Order.insertMany([
        {
            customer_id: customers[0]._id,
            restaurant_id: restaurants[0]._id,
            deliverypartner_id: partners[0]._id,
            delivery_address: "Address 1",
            items: [
                { item_id: menuItems[0]._id, quantity: 2 }
            ]
        }
    ]);

    // =========================
    // PAYMENTS
    // =========================
    await Payment.insertMany([
        {
            order_id: orders[0]._id,
            amount: 598,
            payment_method: "UPI",
            payment_status: "Paid"
        }
    ]);

    // =========================
    // REVIEWS
    // =========================
    await Review.insertMany([
        {
            customer_id: customers[0]._id,
            restaurant_id: restaurants[0]._id,
            rating: 5,
            comment: "Excellent"
        }
    ]);

    console.log("✅ FULL DATABASE READY");
    process.exit();
}

initDB();