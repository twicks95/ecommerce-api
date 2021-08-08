const fs = require('fs')
const wrapper = require('../../helpers/wrapper')
const model = require('./product_model')

module.exports = {
  getProductList: async (req, res) => {
    try {
      let { keyword, limit, order, page } = req.query

      keyword = keyword || ''
      order = order || 'id ASC'
      page = parseInt(page) || 1
      limit = parseInt(limit) || 20

      const offset = page * limit - limit
      const dataCount = await model.getDataCount(keyword)
      const totalData = dataCount[0].total
      const totalPage = Math.ceil(totalData / limit)
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData
      }

      const result = await model.getAllData(keyword, order, limit, offset)
      if (result.length > 0) {
        return wrapper.response(
          res,
          200,
          'Success get product list',
          result,
          pageInfo
        )
      } else {
        return wrapper.response(res, 404, 'No products found', result)
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error.message)
    }
  },

  insertProduct: async (req, res) => {
    try {
      const { name, price } = req.body

      const setData = {
        owner_id: req.decodeToken.id,
        name,
        price: parseInt(price),
        image: req.file ? req.file.filename : ''
      }

      const result = await model.insertData(setData)
      return wrapper.response(res, 200, 'Success create new product', result)
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error.message)
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params
      const { name, price } = req.body

      const data = await model.getDataById(id)
      if (data.length > 0) {
        if (data[0].image) {
          const filename = data[0].image
          const imageExistInFolder = fs.existsSync(`src/uploads/${filename}`)
          console.log(imageExistInFolder)
          if (imageExistInFolder) {
            fs.unlink(`src/uploads/${filename}`, (err) => {
              if (err) throw err
            })
          }
        }

        const setData = {
          name,
          price: parseInt(price),
          image: req.file ? req.file.filename : '',
          updated_at: new Date(Date.now())
        }

        const result = await model.updateData(setData, id)
        return wrapper.response(res, 200, 'Success update data product', result)
      } else {
        return wrapper.response(res, 404, 'No product data is updated')
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error.message)
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params

      const data = await model.getDataById(id)
      if (data.length > 0) {
        if (data[0].image) {
          const filename = data[0].image
          const imageExistInFolder = fs.existsSync(`src/uploads/${filename}`)
          if (imageExistInFolder) {
            fs.unlink(`src/uploads/${filename}`, (err) => {
              if (err) throw err
            })
          }
        }

        const result = await model.deleteData(id)
        return wrapper.response(res, 200, 'Success delete product', result)
      } else {
        return wrapper.response(res, 404, 'No product data is deleted')
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error.message)
    }
  }
}
