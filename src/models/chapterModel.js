import mongoose from 'mongoose'

const chapterSchema = new mongoose.Schema(
  {
    mangaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manga',
      required: true,
      index: true,
    },
    chapterNumber: { type: Number, required: true, min: 0.1 },
    title: { type: String, required: true, maxlength: 255, trim: true },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    releaseDate: { type: Date, default: Date.now },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

chapterSchema.index({ mangaId: 1, chapterNumber: 1 }, { unique: true })

const Chapter = mongoose.model('Chapter', chapterSchema)
export default Chapter
