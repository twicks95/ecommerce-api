const db = require('../../config/mysql')

module.exports = {
  getAllData: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT cart.id, cart.product_id, products.name, products.image, cart.quantity, cart.total FROM cart 
        JOIN products ON cart.product_id = products.id 
        WHERE cart.user_id = ?`,
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  getDataById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM cart JOIN products ON cart.product_id = products.id WHERE cart.id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  insertData: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO cart SET ?', data, (error, result) => {
        !error
          ? resolve({ id: result.insertId, ...data })
          : reject(new Error(error))
      })
    })
  },

  updateData: (data, id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE cart SET ? WHERE id = ?',
        [data, id],
        (error, result) => {
          !error ? resolve({ id, ...data }) : reject(new Error(error))
        }
      )
    })
  },

  deleteData: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM cart WHERE id = ?', id, (error, result) => {
        !error ? resolve({ deletedId: id }) : reject(new Error(error))
      })
    })
  }
}
