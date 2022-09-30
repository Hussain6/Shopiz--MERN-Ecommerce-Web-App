import express from 'express'
import path from 'path'
import products from './data/products.js'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import morgan from 'morgan'
import cors from 'cors'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

connectDB()
dotenv.config()
const PORT = 5000
const app = express()
const process = "development"
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send("API is running...")
})
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
    res.send("AZWNIxBbnCvw4hWtzjt7G2zmGJ-R2RGXZ52GMTaEXfMy0h-hh6tXFbpD03VzxA6D1rdi0aaZ14bbGSCH")
)

const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, "/frontend/public")))

if (process === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
} else {
    app.get('/', (req, res) => {
        res.send('API is running....')
    })
}

app.use(notFound)
app.use(errorHandler)






app.listen(PORT, console.log(`Server running on port ${PORT}`))