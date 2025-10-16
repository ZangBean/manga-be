const mongoose = require('mongoose')

const mangaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    alternativeTitles: [String],
    author: { type: String, default: 'Đang cập nhật' },
    description: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    genres: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['ongoing', 'completed'],
      default: 'ongoing',
    },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    chapters: [
      {
        chapterNumber: { type: Number, required: true },
        title: { type: String, required: true },
        images: { type: [String], required: true },
        createdAt: { type: Date, default: Date.now },

        translator: {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          name: { type: String, default: 'Ẩn danh' },
          donate: {
            qrImage: { type: String, default: '' },
            bank: {
              accountName: { type: String, default: '' },
              accountNumber: { type: String, default: '' },
              bankName: { type: String, default: '' },
            },
          },
        },
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Manga', mangaSchema)
