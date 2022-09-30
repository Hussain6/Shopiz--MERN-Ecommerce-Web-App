import mongoose from "mongoose";
import users from "./data/users.js";
import products from "./data/products.js";
import User from './models/userModal.js'
import Product from './models/productModal.js'
import Order from './models/orderModal.js'
import connectDB from './config/db.js'

connectDB()

const importData = async () => {
    try {
        await Order.deleteMany().catch(error => {
            console.log(error.message)
        })
        await Product.deleteMany()
        await User.deleteMany()

        const createdUsers = await User.insertMany(users)

        const adminUser = createdUsers[0]._id

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser }
        })

        await Product.insertMany(sampleProducts)

        console.log('Data Imported!')
        process.exit();
    } catch (error) {
        console.error(`${error.message}`)
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()
        console.log("Data Destroyed")
        process.exit();
    }
    catch (error) {
        console.error(`${error}`)
    }
}

if (process.argv[2] === "-d") {
    destroyData()
}
else {
    importData()
}