import express from 'express'
import { auth } from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import validateRequest from '../middlewares/validateRequest.js'

import {
  getHomeData,
  getAllMangas,
  getMangaById,
  getTopViews,
  createManga,
  getMyMangas,
  updateManga,
  deleteManga,
  getLatestUpdatedMangas,
  getAllMangasPaginated,
  getRandomMangas,
} from '../controllers/mangaController.js'

import { createChapter } from '../controllers/chapterController.js'
import {
  createMangaValidator,
  updateMangaValidator,
} from '../validators/mangaValidator.js'

const router = express.Router()

router.get('/home', getHomeData)
router.get('/top-views', getTopViews)
router.get('/latest', getLatestUpdatedMangas)
router.get('/random', getRandomMangas)
router.get('/paginated', getAllMangasPaginated)
router.get('/', getAllMangas)
router.get('/my', auth, getMyMangas)
router.get('/:id', getMangaById)

router.post(
  '/',
  auth,
  validateRequest(createMangaValidator),
  upload.single('cover'),
  createManga
)
router.post(
  '/:mangaId/chapters',
  auth,
  upload.array('pages', 100),
  createChapter
)

router.put(
  '/:id',
  auth,
  upload.single('cover'),
  validateRequest(updateMangaValidator),
  updateManga
)

router.delete('/:id', auth, deleteManga)

export default router
