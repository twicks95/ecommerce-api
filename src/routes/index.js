const express = require('express')
const Route = express.Router()

const authRoute = require('../modules/auth/auth_routes')
const productRoute = require('../modules/product/product_routes')
const cartRoute = require('../modules/cart/cart_routes')

Route.use('/auth', authRoute)
Route.use('/products', productRoute)
Route.use('/cart', cartRoute)

module.exports = Route
