const { PutObjectCommand } = require('@aws-sdk/client-s3')
const r2 = require('@/config/r2')
const path = require('path')
const { randomUUID } = require('crypto')

exports.uploadImageToR2 = async (file, folder = 'manga-covers') => {
  const ext = path.extname(file.originalname)
  const key = `${folder}/${randomUUID()}${ext}`

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  )

  return `${process.env.R2_PUBLIC_URL}/${key}`
}
