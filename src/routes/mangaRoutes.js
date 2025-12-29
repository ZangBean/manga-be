const express = require('express')
const { auth } = require('@/middleware/auth')
const upload = require('@/middleware/upload')
const router = express.Router()

const {
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
} = require('@/controllers/mangaController')

const { updateMangaValidator } = require('@/validators/mangaValidator')
const validateRequest = require('@/middleware/validateRequest')

router.get('/top-views', getTopViews)
router.get('/latest', getLatestUpdatedMangas)
router.get('/random', getRandomMangas)
router.get('/paginated', getAllMangasPaginated)
router.get('/', getAllMangas)
router.get('/my', auth, getMyMangas)
router.get('/:id', getMangaById)

router.post('/', auth, upload.single('cover'), createManga)
router.put(
  '/:id',
  auth,
  upload.single('cover'),
  validateRequest(updateMangaValidator),
  updateManga
)
router.delete('/:id', auth, deleteManga)

module.exports = router
