import mongoose from 'mongoose'
import dotenv from 'dotenv'
import 'colors'

import connectDB from './config/db.js'
import Order from './model/orderModel.js'
import Product from './model/productModel.js'
import User from './model/userModel.js'
import users from './data/users.js'
import products from './data/products.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map((product) => {
      return {
        ...product,
        user: adminUser,
      }
    })

    await Product.insertMany(sampleProducts)

    console.log('Data imported')
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await User.deleteMany()
    await Product.deleteMany()
    await Order.deleteMany()

    console.log('Data destroyed')
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
