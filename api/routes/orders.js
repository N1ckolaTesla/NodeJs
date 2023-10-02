const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orderd get'
    })
})

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Orderd post',
        order: order
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