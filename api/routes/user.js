const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const UsersController = require('../controllers/users')

router.get('/users', UsersController.users_get_all)

router.post('/signup', UsersController.users_post_user)

router.post('/login', UsersController.users_login_user)

router.delete('/:userId', checkAuth, UsersController.users_delete_user)

module.exports = router