const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Get Request Products'
    })
})

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Post Request Products'
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    if (id === 'special') {
        res.status(200).json({
            message: 'Special id'
        })
    } else {
        res.status(200).json({
            message: 'random id'
        })
    }
})

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product'
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product'
    })
})

module.exports = router