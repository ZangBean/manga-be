import Genre from '../models/genreModel.js'
import AppError from '../utils/AppError.js'

export const getAllGenres = async () => {
  return await Genre.find().sort({ name: 1 })
}

export const getGenreById = async (genreId) => {
  const genre = await Genre.findById(genreId)
  if (!genre) throw new AppError('Genre không tồn tại', 404)
  return genre
}

export const createGenre = async ({ name, description }) => {
  const genre = await Genre.create({
    name: name.trim(),
    description: description?.trim() || '',
  })

  return genre
}

export const updateGenre = async (genreId, { name, description }) => {
  const genre = await Genre.findById(genreId)
  if (!genre) throw new AppError('Genre không tồn tại', 404)

  if (name && name.trim() !== genre.name) {
    const existing = await Genre.findOne({ name: name.trim() })
    if (existing && existing._id.toString() !== genreId) {
      throw new AppError('Tên thể loại đã tồn tại', 400)
    }
  }

  const updateData = {}
  if (name) updateData.name = name.trim()
  if (description !== undefined)
    updateData.description = description?.trim() || ''

  return await Genre.findByIdAndUpdate(genreId, updateData, {
    new: true,
    runValidators: true,
  })
}

export const deleteGenre = async (genreId) => {
  const genre = await Genre.findById(genreId)
  if (!genre) throw new AppError('Genre không tồn tại', 404)

  await Genre.findByIdAndDelete(genreId)
  return { message: 'Genre đã được xóa thành công' }
}
