const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/users', (req, res, next) => {
    User.find() //находит все элементы
    .exec()
    .then(users => {
        const response = {
            count: users.length,
            products: users.map(user => {
                return {
                    email: user.email,
                    _id: user._id,
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})//проверяем, нет ли уже зарегестрированного пользователя с данным маилом
    .exec()
    .then(user => {
        if (user.length >= 1) {//потому что если пользователь не существует, то user будет равен пустому массиву
            return res.status(409).json({
                message: 'Mail already exists'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash //теперь пароль пользователя захэширован
                    })
                    user.save()
                    .then(result => {
                        console.log(result)
                        res.status(201).json({
                            message: 'User created',
                            user: result
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
})

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {//тут мы получим массив с максимум одним пользователем, потому что мы предотвращаем создание новых пользователей с одного маила
        if (user.length < 1) {
            return res.status(401).json({//делаем это для того, чтобы мошенники не понимали, существует ли пользователь с таким маилом
                message: 'Auth failed' 
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if (result) {
                const token = jwt.sign(
                    {email: user[0].email, userId: user[0]._id}, 
                    process.env.JWT_KEY,
                    {expiresIn: '1h'}
                )
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                })
            }
            res.status(401).json({ //если пароль неверный
                message: 'Auth failed'
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:userId', (req, res, next) => {
    User.deleteOne({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router