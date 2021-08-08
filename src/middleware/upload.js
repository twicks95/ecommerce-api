const path = require('path')
const multer = require('multer')
const wrapper = require('../helpers/wrapper')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  const extList = ['.jpg', '.png', '.jpeg']
  const ext = path.extname(file.originalname).toLowerCase()
  if (extList.includes(ext)) {
    cb(null, true)
  } else {
    cb(
      new Error('Only accepts image files with jpg, jpeg or png extension!'),
      false
    )
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 }
}).single('image')

const uploadFilter = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return wrapper.response(res, 401, err.message, null)
    } else if (err) {
      // An unknown error occurred when uploading.
      return wrapper.response(res, 401, err.message, null)
    }
    next()
    // Everything went fine.
  })
}
module.exports = uploadFilter
