import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
      index: true,
    },
    imageUrl: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true },
    pageNumber: { type: Number, required: true, min: 1 },
    order: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
)

imageSchema.index({ chapterId: 1, order: 1 }, { unique: true })

const Image = mongoose.model('Image', imageSchema)
export default Image
