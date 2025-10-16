const express = require('express')
const router = express.Router()
const { getAllMangas } = require('../controllers/mangaController')

router.get('/', getAllMangas)

module.exports = router
