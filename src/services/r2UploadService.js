import { PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import r2 from '../config/r2.js'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

const uploadSingleImage = async (buffer, folder, options = {}) => {
  if (!Buffer.isBuffer(buffer)) throw new Error('Buffer ảnh không hợp lệ')

  const { resizeWidth = 1200, quality = 78 } = options
  const key = `${folder}/${randomUUID()}.webp`

  const optimizedBuffer = await sharp(buffer)
    .resize({ width: resizeWidth, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer()

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: optimizedBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  )

  return {
    url: `${process.env.R2_PUBLIC_URL}/${key}`,
    key,
  }
}

const uploadMultipleImages = async (files, folder, options = {}) => {
  if (!Array.isArray(files) || files.length === 0)
    throw new Error('Không có ảnh nào')

  const results = await Promise.all(
    files.map((file, index) =>
      uploadSingleImage(file.buffer, folder, options).then((r) => ({
        ...r,
        page: index + 1,
      }))
    )
  )

  return results.sort((a, b) => a.page - b.page)
}

export const uploadMangaCoverToR2 = (file, mangaId) => {
  if (!mangaId) throw new Error('Cần mangaId')
  return uploadSingleImage(file.buffer, `manga-covers/${mangaId}`)
}

export const uploadChapterImagesToR2 = (files, mangaId, chapterNumber) => {
  if (!mangaId || !chapterNumber)
    throw new Error('Cần mangaId và chapterNumber')
  return uploadMultipleImages(
    files,
    `chapter-images/${mangaId}/${chapterNumber}`
  )
}

const BATCH_SIZE = 1000 // Giới hạn tối đa của S3 DeleteObjects

export const deleteImagesFromR2 = async (keys = []) => {
  if (!Array.isArray(keys) || keys.length === 0) return
  console.log(`Bắt đầu xóa ${keys.length} object trên R2...`)
  for (let i = 0; i < keys.length; i += BATCH_SIZE) {
    const batch = keys.slice(i, i + BATCH_SIZE)

    const command = new DeleteObjectsCommand({
      Bucket: process.env.R2_BUCKET,
      Delete: {
        Objects: batch.map((Key) => ({ Key })),
        Quiet: true,
      },
    })

    try {
      const response = await r2.send(command)

      if (response.Errors?.length > 0) {
        console.error('Có lỗi khi xóa batch:', response.Errors)
      } else {
        console.log(
          `Xóa thành công batch ${i / BATCH_SIZE + 1}: ${batch.length} object`
        )
      }
    } catch (err) {
      console.error('Lỗi khi gọi DeleteObjects:', err)
    }
  }
  console.log(`Hoàn tất xóa ${keys.length} object trên R2`)
}
