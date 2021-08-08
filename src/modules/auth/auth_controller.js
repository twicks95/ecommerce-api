const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const model = require('./auth_model')
const wrapper = require('../../helpers/wrapper')

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body

      // password encyption
      const salt = bcrypt.genSaltSync(10)
      const encryptedPassword = bcrypt.hashSync(password, salt)

      const userData = await model.getDataCondition({ email })
      if (userData.length > 0) {
        return wrapper.response(
          res,
          401,
          'Email is registered',
          userData[0].user_email
        )
      } else {
        const setData = {
          name,
          email,
          password: encryptedPassword
        }
        const result = await model.register(setData)
        delete result.password

        return wrapper.response(res, 200, 'Success register user', result)
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error.message)
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body

      const userData = await model.getDataCondition({ email })
      if (userData.length > 0) {
        const passwordMatch = bcrypt.compareSync(password, userData[0].password)

        if (passwordMatch) {
          const payload = userData[0]
          delete payload.password

          const token = jwt.sign({ ...payload }, 'SECRET', { expiresIn: '24h' })
          const result = { ...payload, token }

          return wrapper.response(res, 200, 'Successfully logged in', result)
        } else {
          return wrapper.response(res, 401, 'Password mismatch')
        }
      } else {
        return wrapper.response(res, 404, 'Email is not registered')
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error.message)
    }
  }
}
