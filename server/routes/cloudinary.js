const express = require('express')
const router = express.Router()

// middleware
const { authCheck,adminCheck } = require('../middleware/auth')

//controller
const { upload, remove } = require('../controllers/cloudinary')

router.post('/upload-image', authCheck, adminCheck, upload)
router.post('/remove-image', authCheck, adminCheck, remove)

module.exports = router