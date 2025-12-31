import mongoose from 'mongoose'

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
  { timestamps: true }
)

const MangaGenre = mongoose.model('MangaGenre', mangaGenreSchema)
export default MangaGenre
