import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import 'colors'

import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

app.use('/api/v1/products', productRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/upload', uploadRoutes)

app.use(notFound)

app.use(errorHandler)

app.get('/api/v1/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get('/', (req, res) => {
  res.send('app is running...')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
