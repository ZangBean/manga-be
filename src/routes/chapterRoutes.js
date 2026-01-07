import express from 'express'
import { auth } from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import validateRequest from '../middlewares/validateRequest.js'

import { createChapter } from '../controllers/chapterController.js'
import { createChapterValidator } from '../validators/chapterValidator.js'

const router = express.Router({ mergeParams: true }) // mergeParams để nhận mangaId từ parent route

// POST /api/mangas/:mangaId/chapters - Tạo chapter mới
router.post(
  '/',
  auth,
  upload.array('pages', 100),
  validateRequest(createChapterValidator),
  createChapter
)

// TODO: Thêm các routes sau
// GET /api/mangas/:mangaId/chapters - Lấy danh sách chapters của manga
// GET /api/mangas/:mangaId/chapters/:chapterId - Lấy chapter cụ thể
// PUT /api/mangas/:mangaId/chapters/:chapterId - Cập nhật chapter
// DELETE /api/mangas/:mangaId/chapters/:chapterId - Xóa chapter

export default router
