const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//routes which should handle requests
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')

mongoose.connect(
    'mongodb+srv://N1colaTesla:' + process.env.MONGO_ATLAS_PW + '@atlascluster.g5oscpc.mongodb.net/',
    { useNewUrlParser: true, useUnifiedTopology: true }
)

//использует morgan для отображения процессов в терминале
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))//делаем роут uploads доступной для всех
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//добавляет headers. Это не отправляет ответ, это только настраивает его
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') //добавляем Access-Control-Allow-Origin
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-Width, Content-Type, Accept, Authorization'
    )
    if (req.method === 'OPTIONS') { //когда мы отправляем POST или PUT запрос, браузер сначала отправляет OPTIONS запрос, чтобы узнать, позволено ли нам делать этот запрос
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)


//этот middleware возвращает ошибку, когда пользователь переходит по несуществующему роуту
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

//этот middleware возвращает все ошибки, такие как ошибка выше или ошибки, возникшие в любом месте в приложении
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app