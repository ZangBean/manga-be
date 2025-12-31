import mongoose from 'mongoose'

const mangaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 255, trim: true },
    description: { type: String, trim: true },
    coverImageUrl: { type: String, maxlength: 255, trim: true },
    coverImageKey: { type: String, maxlength: 255, trim: true },
    likeCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'hiatus'],
      default: 'ongoing',
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

const Manga = mongoose.model('Manga', mangaSchema)
export default Manga
