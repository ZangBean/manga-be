const mangaService = require('@/services/mangaService')

exports.getAllMangas = async (req, res, next) => {
  try {
    const mangas = await mangaService.getAllMangas()
    res.json(mangas)
  } catch (err) {
    next(err)
  }
}

exports.getMangaById = async (req, res, next) => {
  try {
    const { id } = req.params
    const manga = await mangaService.getMangaById(id)
    res.json(manga)
  } catch (err) {
    next(err)
  }
}

exports.getTopViews = async (req, res) => {
  try {
    const limit = req.query.limit
    const mangas = await mangaService.getTopViews(limit)
    res.json(mangas)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createManga = async (req, res, next) => {
  try {
    const savedManga = await mangaService.createManga(req.body)
    res.status(201).json(savedManga)
  } catch (err) {
    next(err)
  }
}

exports.updateManga = async (req, res, next) => {
  try {
    const { id } = req.params
    const updatedManga = await mangaService.updateManga(id, req.body)
    if (!updatedManga)
      return res.status(404).json({ message: 'Manga not found' })
    res.json(updatedManga)
  } catch (err) {
    next(err)
  }
}

exports.deleteManga = async (req, res, next) => {
  try {
    const { id } = req.params
    const deletedManga = await mangaService.deleteManga(id)
    if (!deletedManga)
      return res.status(404).json({ message: 'Manga not found' })
    res.json({ message: 'Manga deleted successfully' })
  } catch (err) {
    next(err)
  }
}
