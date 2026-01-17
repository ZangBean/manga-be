import mongoose from 'mongoose'
import slugify from 'slugify'
import { MANGA_STATUS } from '../constants/index.js'

const mangaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 255, trim: true },
    altTitles: [{ type: String, trim: true }],
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true },
    coverImageUrl: { type: String, maxlength: 255, trim: true },
    coverImageKey: { type: String, maxlength: 255, trim: true },
    likeCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
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
    type: {
      type: String,
      enum: ['manga', 'manhua', 'manhwa', 'truyenvn'],
      default: 'manga',
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

mangaSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    let baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: 'vi',
    })

    let finalSlug = baseSlug
    let counter = 1

    while (
      await mongoose.models.Manga.findOne({
        slug: finalSlug,
        _id: { $ne: this._id },
      })
    ) {
      finalSlug = `${baseSlug}-${counter}`
      counter++
    }

    this.slug = finalSlug
  }
  next()
})

mangaSchema.index(
  {
    title: 'text',
    altTitles: 'text',
    author: 'text',
  },
  {
    weights: { title: 10, altTitles: 5, author: 1 },
    name: 'MangaTextSearchIndex',
  }
)

mangaSchema.index({ viewCount: -1 })
mangaSchema.index({ createdAt: -1 })

const Manga = mongoose.model('Manga', mangaSchema)
export default Manga
