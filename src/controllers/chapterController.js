const { PutObjectCommand } = require('@aws-sdk/client-s3')
const r2 = require('../config/r2')

exports.uploadImages = async (req, res, next) => {
  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: 'test/test.jpg',
        Body: req.files[0].buffer,
        ContentType: req.files[0].mimetype,
      })
    )

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
