const express = require('express')
const Route = express.Router()
const {
  addItem,
  deleteItem,
  getItems,
  updateQuantity
} = require('./cart_controller')
const { authentication } = require('../../middleware/auth')

Route.get('/list', authentication, getItems)
Route.post('/:productId', authentication, addItem)
Route.patch('/:id', authentication, updateQuantity)
Route.delete('/', authentication, deleteItem)

module.exports = Route
