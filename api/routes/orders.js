const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orderd get'
    })
})

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orderd post'
    })
})

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Orderd get',
        orderId: req.params.orderId
    })
})

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Orderd get',
        orderId: req.params.orderId
    })
})

module.exports = router