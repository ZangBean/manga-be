const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    imageUrl: { type: String, trim: true },
    pageNumber: { type: Number },
    order: { type: Number, required: true },
  },
  { timestamps: true }
)
imageSchema.index({ chapterId: 1, order: 1 })

module.exports = mongoose.model('Image', imageSchema)
