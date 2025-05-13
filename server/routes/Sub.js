const express = require('express')
const router = express.Router()

// middleware
const { authCheck,adminCheck } = require('../middleware/auth')

//controller
const { create, read, update, remove, list } = require('../controllers/sub')

// routes
router.post('/sub', authCheck, adminCheck, create)
router.get('/sub/:slug', read)
router.put('/sub/:slug', authCheck, adminCheck, update)
router.delete('/sub/:slug', authCheck, adminCheck, remove)
router.get('/subs', list)

module.exports = router;