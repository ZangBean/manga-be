const Manga = require('@/models/mangaModel')

const getAllMangas = async () => {
  return Manga.find()
}

const getMangaById = async (id) => {
  return Manga.findById(id)
}

const createManga = async (data) => {
  const manga = new Manga(data)
  return manga.save()
}

const updateManga = async (id, data) => {
  return Manga.findByIdAndUpdate(id, data, { new: true })
}

const deleteManga = async (id) => {
  return Manga.findByIdAndDelete(id)
}

module.exports = {
  getAllMangas,
  getMangaById,
  createManga,
  updateManga,
  deleteManga,
}
