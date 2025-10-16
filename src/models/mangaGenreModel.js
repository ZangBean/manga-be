const mongoose = require('mongoose')

const mangaGenreSchema = new mongoose.Schema(
  {
    mangaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manga',
      required: true,
    },
    genreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('MangaGenre', mangaGenreSchema)
