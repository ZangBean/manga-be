import {
  getAllGenres as getAllGenresService,
  getGenreById as getGenreByIdService,
  createGenre as createGenreService,
  updateGenre as updateGenreService,
  deleteGenre as deleteGenreService,
} from '../services/genreService.js'

const ok = (res, data) => res.json({ success: true, data })

export const getAllGenres = async (req, res, next) => {
  try {
    const genres = await getAllGenresService()
    ok(res, genres)
  } catch (err) {
    next(err)
  }
}

export const getGenreById = async (req, res, next) => {
  try {
    const genre = await getGenreByIdService(req.params.id)
    ok(res, genre)
  } catch (err) {
    next(err)
  }
}

export const createGenre = async (req, res, next) => {
  try {
    const { name, description } = req.body
    const genre = await createGenreService({ name, description })
    res.status(201).json({ success: true, data: genre })
  } catch (err) {
    next(err)
  }
}

export const updateGenre = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description } = req.body
    const genre = await updateGenreService(id, { name, description })
    ok(res, genre)
  } catch (err) {
    next(err)
  }
}

export const deleteGenre = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await deleteGenreService(id)
    ok(res, result)
  } catch (err) {
    next(err)
  }
}
