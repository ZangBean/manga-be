const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema(
  {
    chapterNumber: { type: Number, required: true },
    title: { type: String, required: true, maxlength: 255, trim: true },
    viewCount: { type: Number, default: 0 },
    releaseDate: { type: Date },
    likeCount: { type: Number, default: 0 },
    mangaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manga',
      required: true,
    },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)
chapterSchema.index({ mangaId: 1, chapterNumber: 1 }, { unique: true })

module.exports = mongoose.model('Chapter', chapterSchema)
