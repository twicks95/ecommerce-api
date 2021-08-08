const wrapper = require('../../helpers/wrapper')
const model = require('./cart_model')
const { getDataById } = require('../product/product_model')

module.exports = {
  getItems: async (req, res) => {
    try {
      const id = req.decodeToken.id
      const result = await model.getAllData(id)
      if (result.length > 0) {
        wrapper.response(res, 400, 'Success get all items', result)
      } else {
        wrapper.response(res, 404, 'You dont have any items in your cart')
      }
    } catch (error) {
      wrapper.response(res, 400, 'Bad request', error.message)
    }
  },

  addItem: async (req, res) => {
    try {
      const { productId } = req.params
      const { quantity } = req.body
      const userId = req.decodeToken.id

      const productData = await getDataById(productId)
      if (productData[0].owner_id === userId) {
        wrapper.response(res, 403, 'Cannot add your own product')
      } else {
        const { price } = productData[0]
        const setData = {
          user_id: userId,
          product_id: productId,
          quantity,
          total: price * quantity
        }
        const result = await model.insertData(setData)
        wrapper.response(res, 200, 'Successfully added to cart', result)
      }
    } catch (error) {
      wrapper.response(res, 400, 'Bad request', error.message)
    }
  },

  updateQuantity: async (req, res) => {
    try {
      const { id } = req.params
      const { quantity } = req.body

      if (parseInt(quantity) !== 0) {
        const productData = await model.getDataById(id)
        const { price } = productData[0]
        const setData = {
          quantity,
          total: price * quantity,
          updated_at: new Date(Date.now())
        }
        const result = await model.updateData(setData, id)
        wrapper.response(res, 200, "Success update item's quantity", result)
      } else {
        wrapper.response(res, 400, 'Cannot accept 0 quantity')
      }
    } catch (error) {
      wrapper.response(res, 400, 'Bad request', error.message)
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { selectedItem } = req.body

      const deletedId = []
      for (const item of selectedItem) {
        const result = await model.deleteData(item)
        deletedId.push(result.deletedId)
      }
      wrapper.response(res, 200, 'Success delete selected item', { deletedId })
    } catch (error) {
      wrapper.response(res, 400, 'Bad request', error.message)
    }
  }
}
