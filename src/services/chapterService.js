import Chapter from '../models/chapterModel.js'
import ChapterImage from '../models/imageModel.js'
import Manga from '../models/mangaModel.js'
import { uploadChapterImagesToR2 } from './r2UploadService.js'

export const createChapter = async ({
  mangaId,
  chapterNumber,
  title = '',
  uploaderId,
  files = [],
}) => {
  // 1. Kiểm tra manga tồn tại & quyền (business rule)
  const manga = await Manga.findById(mangaId)
  if (!manga) throw new AppError('Manga không tồn tại', 404)
  if (manga.uploaderId.toString() !== uploaderId) {
    throw new AppError('Không có quyền upload chapter cho truyện này', 403)
  }

  // 2. Kiểm tra chapter number trùng
  const existing = await Chapter.findOne({ mangaId, chapterNumber })
  if (existing) throw new AppError(`Chapter ${chapterNumber} đã tồn tại`, 400)

  // 3. Tạo chapter
  const newChapter = await Chapter.create({
    mangaId,
    chapterNumber: Number(chapterNumber),
    title: title.trim() || `Chapter ${chapterNumber}`,
    uploaderId,
  })

  // 4. Upload images nếu có
  let uploadedPages = []
  if (files?.length > 0) {
    uploadedPages = await uploadChapterImagesToR2(files, mangaId, chapterNumber)
  }

  // 5. Lưu images vào DB
  if (uploadedPages.length) {
    const images = uploadedPages.map((img) => ({
      chapterId: newChapter._id,
      imageUrl: img.url,
      key: img.key,
      pageNumber: img.page,
      order: img.page,
    }))
    await ChapterImage.insertMany(images)
  }

  // 6. Cập nhật Manga (transaction optional)
  const updated = await Manga.findByIdAndUpdate(
    mangaId,
    {
      $inc: { totalChapters: 1 },
      latestChapterDate: new Date(),
      latestChapterNumber: chapterNumber,
    },
    { new: true } // trả về document sau update
  )

  // 7. Trả về full chapter
  const fullChapter = await getChapterWithImages(newChapter._id)
  return fullChapter
}

export const saveChapterImages = async (chapterId, uploadedPages) => {
  const images = uploadedPages.map((img) => ({
    chapterId,
    imageUrl: img.url,
    key: img.key,
    pageNumber: img.page,
    order: img.page,
  }))

  await ChapterImage.insertMany(images)
}

export const getChapterWithImages = async (chapterId) => {
  const chapter = await Chapter.findById(chapterId).populate('mangaId', 'title')
  if (!chapter) return null

  const images = await ChapterImage.find({ chapterId })
    .sort({ order: 1 })
    .select('imageUrl pageNumber order')

  return { ...chapter.toObject(), pages: images }
}
