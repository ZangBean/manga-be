const {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} = require('@aws-sdk/client-s3')
const r2 = require('@/config/r2')
const { randomUUID } = require('crypto')
const sharp = require('sharp')

exports.uploadImageToR2 = async (file, folder = 'manga-images') => {
  if (!file || !file.buffer) {
    throw new Error('Invalid file')
  }

  const key = `${folder}/${randomUUID()}.webp`

  const optimizedBuffer = await sharp(file.buffer)
    .resize({
      width: 1000,
      withoutEnlargement: true,
    })
    .toFormat('webp', { quality: 75 })
    .toBuffer()

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: optimizedBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable', // CDN cache 1 năm
    })
  )

  return {
    url: `${process.env.R2_PUBLIC_URL}/${key}`,
    key,
  }
}

exports.deleteImageFromR2 = async (key) => {
  if (!key) return

  try {
    await r2.send(
      new HeadObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
      })
    )

    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
      })
    )

    console.log(`Deleted image from R2: ${key}`)
  } catch (err) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      console.log(`Image not found on R2: ${key}`)
    } else {
      console.error('Error deleting image from R2:', err)
    }
  }
}
