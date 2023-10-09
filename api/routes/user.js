const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

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
    User.find({email: req.body.email})
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
                            message: 'User created'
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