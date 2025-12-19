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

const getTopViews = async (limit = 10) => {
  const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 10))
  return await Manga.find({})
    .sort({ viewCount: -1 })
    .limit(safeLimit)
    .select('title coverImageUrl description viewCount')
    .lean()
}

module.exports = {
  getAllMangas,
  getMangaById,
  createManga,
  updateManga,
  deleteManga,
  getTopViews,
}
