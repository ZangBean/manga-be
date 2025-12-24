const express = require('express')
const upload = require('@/middleware/upload')
const controller = require('@/controllers/chapterController')

const router = express.Router()

router.post(
  '/:chapterId/images',
  upload.array('images'),
  controller.uploadImages
)

module.exports = router
