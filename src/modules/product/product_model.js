const db = require('../../config/mysql')

module.exports = {
  getDataById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM products WHERE id = ?', id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },

  getAllData: (keyword, order, limit, offset) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM products WHERE name LIKE "%"?"%" ORDER BY ${order} LIMIT ? OFFSET ?`,
        [keyword, limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  getDataCount: (keyword) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT COUNT(*) AS total FROM products WHERE name LIKE "%"?"%"',
        keyword,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  insertData: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO products SET ?', data, (error, result) => {
        if (!error) {
          resolve({ id: result.insertId, ...data })
        } else {
          reject(new Error(error))
        }
      })
    })
  },

  updateData: (data, id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE products SET ? WHERE id = ?',
        [data, id],
        (error, result) => {
          !error ? resolve({ id, ...data }) : reject(new Error(error))
        }
      )
    })
  },

  deleteData: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM products WHERE id = ?', id, (error, result) => {
        !error ? resolve({ productId: id }) : reject(new Error(error))
      })
    })
  }
}
