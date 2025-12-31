import mongoose from 'mongoose'

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mangaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manga',
      required: true,
    },
  },
  { timestamps: true }
)

favoriteSchema.index({ userId: 1, mangaId: 1 }, { unique: true })

const Favorite = mongoose.model('Favorite', favoriteSchema)
export default Favorite
