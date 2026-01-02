import mongoose from 'mongoose'
import { MANGA_STATUS } from '../constants/index.js'

const mangaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 255, trim: true },
    description: { type: String, trim: true },
    coverImageUrl: { type: String, maxlength: 255, trim: true },
    coverImageKey: { type: String, maxlength: 255, trim: true },
    likeCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(MANGA_STATUS),
      default: MANGA_STATUS.ONGOING,
    },
    releaseDate: { type: Date },
    author: { type: String, maxlength: 255, trim: true },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    totalChapters: {
      type: Number,
      default: 0,
      min: 0,
    },
    translationGroup: { type: String, maxlength: 255, trim: true },
  },
  { timestamps: true, versionKey: false }
)

mangaSchema.index({ title: 'text', author: 1 })
mangaSchema.index({ viewCount: -1 })
mangaSchema.index({ createdAt: -1 })

const Manga = mongoose.model('Manga', mangaSchema)
export default Manga
