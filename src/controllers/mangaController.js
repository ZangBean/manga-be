const Manga = require('../models/mangaModel')

exports.getAllMangas = async (req, res) => {
  try {
    const mangas = await Manga.find()
    res.json(mangas)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
