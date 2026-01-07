import mongoose from 'mongoose'

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
      unique: true,
      trim: true,
    },
    description: { type: String },
  },
  { timestamps: true }
)

const Genre = mongoose.model('Genre', genreSchema)
export default Genre
