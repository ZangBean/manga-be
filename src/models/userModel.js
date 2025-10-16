const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, maxlength: 100, trim: true },
    avatar: { type: String, maxlength: 255, trim: true },
    email: {
      type: String,
      maxlength: 100,
      unique: true,
      trim: true,
      required: true,
    },
    password: { type: String, maxlength: 255 },
    role: {
      type: String,
      enum: ['user', 'uploader', 'admin'],
      default: 'user',
    },
    uploadedManga: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manga' }],
    isBanned: { type: Boolean, default: false },
    providers: [
      {
        name: {
          type: String,
          enum: ['local', 'google', 'facebook'],
          required: true,
        },
        providerId: { type: String },
      },
    ],
    emailVerificationToken: { type: String },
    emailVerificationExpire: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    lastLoginAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)
userSchema.index({ email: 1, username: 1 })

module.exports = mongoose.model('User', userSchema)
