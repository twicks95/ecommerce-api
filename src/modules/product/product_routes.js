const express = require('express')
const Route = express.Router()
const {
  deleteProduct,
  getProductList,
  insertProduct,
  updateProduct
} = require('./product_controller')
const { authentication } = require('../../middleware/auth')
const upload = require('../../middleware/upload')

Route.get('/', authentication, getProductList)
Route.post('/', authentication, upload, insertProduct)
Route.patch('/:id', authentication, upload, updateProduct)
Route.delete('/:id', authentication, deleteProduct)

module.exports = Route
