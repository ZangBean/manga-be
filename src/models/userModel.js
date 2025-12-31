import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      maxlength: 100,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      maxlength: 255,
      select: false,
    },

    displayName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: 'Người dùng',
    },

    avatar: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    role: {
      type: String,
      enum: ['user', 'uploader', 'admin'],
      default: 'user',
    },

    providers: [
      {
        name: {
          type: String,
          enum: ['local', 'google', 'facebook'],
          required: true,
        },
        providerId: {
          type: String,
          required: true,
        },
        email: String,
      },
    ],

    isBanned: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },

    emailVerificationToken: String,
    emailVerificationExpire: Date,

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    lastLoginAt: Date,
    lastActiveAt: Date,

    preferences: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: () =>
        new Map([
          ['theme', 'system'],
          ['language', 'vi'],
        ]),
    },
  },
  { timestamps: true }
)

/* hooks */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  try {
    this.password = await bcrypt.hash(this.password, 12)
    next()
  } catch (err) {
    next(err)
  }
})

/* methods */
userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.isRecentlyActive = function (minutes = 5) {
  if (!this.lastActiveAt) return false
  return this.lastActiveAt > new Date(Date.now() - minutes * 60 * 1000)
}

/* indexes */
userSchema.index({ 'providers.name': 1, 'providers.providerId': 1 })
userSchema.index({ lastActiveAt: 1 })

const User = mongoose.model('User', userSchema)
export default User
