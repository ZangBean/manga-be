import express from 'express'
import { auth, requireRole } from '../middlewares/auth.js'
import validateRequest from '../middlewares/validateRequest.js'

import {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
} from '../controllers/genreController.js'

import {
  createGenreValidator,
  updateGenreValidator,
} from '../validators/genreValidator.js'

const router = express.Router()

router.get('/', getAllGenres)
router.get('/:id', getGenreById)

router.post(
  '/',
  auth,
  requireRole('admin'),
  validateRequest(createGenreValidator),
  createGenre
)

router.put(
  '/:id',
  auth,
  requireRole('admin'),
  validateRequest(updateGenreValidator),
  updateGenre
)

router.delete('/:id', auth, requireRole('admin'), deleteGenre)

export default router
