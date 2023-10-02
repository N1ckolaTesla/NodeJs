const express = require('express')
const app = express()
const morgan = require('morgan')

//routes which should handle requests
const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')

app.use(morgan('dev'))

app.use('/products', productsRoutes)
app.use('/orders', ordersRoutes)


//этот middleware вовзоращает ошибку, когда пользователь переходит по несуществующему роуту
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

//этот middleware вовзоращает любую ошибку
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app