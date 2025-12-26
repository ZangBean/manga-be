const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      maxlength: 100,
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

    // Trạng thái tài khoản
    isBanned: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Token cho verify email & reset password
    emailVerificationToken: String,
    emailVerificationExpire: Date,

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Theo dõi hoạt động
    lastLoginAt: Date,
    lastActiveAt: Date,

    // Cài đặt cá nhân (theme, ngôn ngữ,...)
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
  {
    timestamps: true,
  }
)

// HOOK: Tự động hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// METHOD: So sánh password (dùng khi login local)
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

// METHOD: Kiểm tra user có active gần đây không
userSchema.methods.isRecentlyActive = function (minutes = 5) {
  if (!this.lastActiveAt) return false
  const threshold = new Date(Date.now() - minutes * 60 * 1000)
  return this.lastActiveAt > threshold
}

// INDEXES - Tối ưu query
userSchema.index({ email: 1 }, { sparse: true, unique: true })
userSchema.index({ 'providers.name': 1, 'providers.providerId': 1 })
userSchema.index({ lastActiveAt: 1 }) // Hỗ trợ query user active gần đây

module.exports = mongoose.model('User', userSchema)
