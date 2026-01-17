import express from 'express'
import { auth } from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import validateRequest from '../middlewares/validateRequest.js'

import {
  getAllMangas,
  getMangaBySlug,
  getMangaById,
  getTopViews,
  createManga,
  getMyMangas,
  updateManga,
  deleteManga,
  getLatestUpdatedMangas,
  getAllMangasPaginated,
  getRandomMangas,
  getRandomMangasByGenres,
} from '../controllers/mangaController.js'

import {
  createMangaValidator,
  updateMangaValidator,
} from '../validators/mangaValidator.js'

const router = express.Router()

router.get('/top-views', getTopViews)
router.get('/latest', getLatestUpdatedMangas)
router.get('/random', getRandomMangas)
router.get('/random-by-genres', getRandomMangasByGenres)
router.get('/paginated', getAllMangasPaginated)
router.get('/', getAllMangas)
router.get('/my', auth, getMyMangas)
router.get('/info/:slug', getMangaBySlug)

router.post(
  '/',
  auth,
  upload.single('cover'),
  validateRequest(createMangaValidator),
  createManga
)

router.get('/:id', getMangaById)

router.put(
  '/:id',
  auth,
  upload.single('cover'),
  validateRequest(updateMangaValidator),
  updateManga
)

router.delete('/:id', auth, deleteManga)

export default router
