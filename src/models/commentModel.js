const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    mangaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manga',
      required: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: String, required: true, trim: true },
    isSpoiler: { type: Boolean, default: false },
    likeCount: { type: Number, default: 0 },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved',
    },
  },
  { timestamps: true }
)

commentSchema.index({ mangaId: 1 })
commentSchema.index({ chapterId: 1 })

module.exports = mongoose.model('Comment', commentSchema)
