const express = require('express')
const router = express.Router()
const {
  getAllMangas,
  getMangaById,
  getTopViews,
  createManga,
  updateManga,
  deleteManga,
  getLatestUpdatedMangas,
  getAllMangasPaginated,
} = require('@/controllers/mangaController')

const {
  createMangaValidator,
  updateMangaValidator,
} = require('@/validators/mangaValidator')
const validateRequest = require('@/middleware/validateRequest')

router.get('/top-views', getTopViews)
router.get('/latest', getLatestUpdatedMangas)
router.get('/', getAllMangas)
router.get('/:id', getMangaById)
router.get('/paginated', getAllMangasPaginated)
router.post('/', validateRequest(createMangaValidator), createManga)
router.put('/:id', validateRequest(updateMangaValidator), updateManga)
router.delete('/:id', deleteManga)

module.exports = router
