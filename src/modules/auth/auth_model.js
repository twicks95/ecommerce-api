const db = require('../../config/mysql')

module.exports = {
  getDataCondition: (data) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE ?', data, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },

  register: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO users SET ?', data, (error, result) => {
        if (!error) {
          resolve({ id: result.insertId, ...data })
        } else {
          reject(new Error(error))
        }
      })
    })
  }
}
