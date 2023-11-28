const express = require('express')
const router = express.Router() 

const {
    login,
    register,
    authenticateToken,
    findAllUsers,
    proteced
} = require('../controllers/index')

router.get('/users',authenticateToken,findAllUsers)
router.post('/login',login)
router.post('/register',register)
router.get('/protected',authenticateToken,proteced)

module.exports = router;