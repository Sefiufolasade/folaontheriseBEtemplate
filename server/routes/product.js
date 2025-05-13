const express = require('express')
const router = express.Router()

// middleware
const { authCheck,adminCheck } = require('../middleware/auth')

//controller
const { create, listAll, read, remove, update, list, productsCount, productStar, listRelated, searchFilters } = require('../controllers/product')

// routes
router.post('/product', authCheck, adminCheck, create)
router.get('/products/total', productsCount)
router.get('/product/:slug', read)
router.put('/product/:slug', authCheck, adminCheck, update)
router.delete('/product/:slug', authCheck, adminCheck, remove)
router.get('/products/:count', listAll)

router.post('/products', list)
router.post('/search/filters', searchFilters)

// rating
router.put('/product/star/:productId', authCheck, productStar)
router.get('/product/related/:productId', listRelated)
module.exports = router;