import jwt from 'jsonwebtoken'
import User from '../models/userModal.js'
import AsyncHandler from 'express-async-handler'


const JWT_SECRET = "abc123"
const protect = AsyncHandler(async (req, res, next) => {

    let token = req.headers.authorization.split(' ')[1]
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not Authorized, token failed')
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }

}
)

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    }
    else {
        res.status(401)
        throw new Error('Not authorized as an admin')
    }
}

export { protect, admin }