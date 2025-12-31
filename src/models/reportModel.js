import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mangaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manga',
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

// index đúng schema
reportSchema.index({ status: 1 })
reportSchema.index({ mangaId: 1 })
reportSchema.index({ chapterId: 1 })
reportSchema.index({ commentId: 1 })

const Report = mongoose.model('Report', reportSchema)
export default Report
