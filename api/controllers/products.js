const mongoose = require('mongoose')
const Product = require('../models/product')

exports.products_get_all = (req, res, next) => {
    Product.find() //находит все элементы
    .select('name price _id productImage') //это означает, что мы будем возвращать только эти поля
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}

exports.products_post_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product
    .save() //сохраняет объект в базу данных
    .then(result => {
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result.id,
                productImage: result.productImage,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId
    Product
    .findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log(doc)
        if (doc) {
            res.status(200).json({
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products'
                }
            })
        } else {
            res.status(404).json({message: 'No valid entry found for provided ID'})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}

exports.products_patch_product = (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    console.log('body', req.body)
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({
            message: 'Product was updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product was deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: {name: 'String', price: 'Number'}
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}