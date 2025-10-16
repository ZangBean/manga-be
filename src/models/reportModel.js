const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mangaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga' },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  },
  { timestamps: true }
)
reportSchema.index({ status: 1 })
mangaGenreSchema.index({ mangaId: 1, genreId: 1 }, { unique: true })
mangaGenreSchema.index({ genreId: 1 })

module.exports = mongoose.model('Report', reportSchema)
