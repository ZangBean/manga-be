import { createChapter as createChapterService } from '../services/chapterService.js'

export const createChapter = async (req, res, next) => {
  try {
    const { mangaId } = req.params
    const { chapterNumber, title } = req.body
    const files = req.files || []

    if (!mangaId || !chapterNumber) {
      return res
        .status(400)
        .json({ success: false, message: 'Thiếu thông tin' })
    }

    const fullChapter = await createChapterService({
      mangaId,
      chapterNumber,
      title,
      uploaderId: req.user.id,
      files,
    })

    res.status(201).json({ success: true, data: fullChapter })
  } catch (err) {
    next(err)
  }
}
