use("fooddeliverysystem")

db.customers.insertOne({
  name: "Pushkar",
  email: "pushkar@gmail.com",
  password: "123456",
  city: "Pune"
})

db.menuitems.insertMany([
  { item_name: "Test Pizza", price: 250, category: "Pizza", availability_status: true },
  { item_name: "Test Burger", price: 150, category: "Burger", availability_status: true }
])

db.restaurants.find({})

db.orders.find({})

db.orders.find({ order_status: "Pending" })

db.orders.find({ order_status: "Out for Delivery" })

db.menuitems.find({ price: { $lt: 200 } })

db.menuitems.find({ availability_status: true })

db.menuitems.find({ category: "Pizza" })

db.menuitems.find({
  item_name: { $regex: "Burger", $options: "i" }
})

db.menuitems.find().sort({ price: 1 })

db.menuitems.find().sort({ price: -1 }).limit(5)

db.menuitems.updateOne(
  { item_name: "Margherita Pizza" },
  { $set: { price: 320 } }
)

db.menuitems.updateMany(
  { category: "Burger" },
  { $set: { availability_status: false } }
)

db.customers.deleteOne({
  email: "pushkar@gmail.com"
})

db.menuitems.deleteMany({
  availability_status: false
})

db.menuitems.aggregate([
  {
    $group: {
      _id: "$category",
      totalItems: { $sum: 1 }
    }
  }
])

db.menuitems.aggregate([
  {
    $group: {
      _id: "$category",
      avgPrice: { $avg: "$price" }
    }
  }
])

db.orders.aggregate([
  {
    $group: {
      _id: "$order_status",
      totalOrders: { $sum: 1 }
    }
  }
])

db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customerDetails"
    }
  }
])

db.menuitems.createIndex({ price: 1 })

db.orders.createIndex({ order_status: 1 })

db.menuitems.find({
  price: { $gt: 100, $lt: 300 }
})

db.orders.find({
  "items.quantity": { $gte: 1 }
})