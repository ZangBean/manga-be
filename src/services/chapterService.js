const sharp = require('sharp')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const r2 = require('@/config/r2')

exports.uploadChapterImages = async ({ files, mangaId, chapterId }) => {
  const images = []

  for (let i = 0; i < files.length; i++) {
    const buffer = await sharp(files[i].buffer).webp({ quality: 80 }).toBuffer()

    const key = `manga/${mangaId}/chapter/${chapterId}/${i + 1}.webp`

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: 'image/webp',
      })
    )

    images.push({
      order: i + 1,
      url: `${process.env.R2_PUBLIC_URL}/${key}`,
    })
  }

  return images
}
