const User = require('@/models/userModel')
const jwt = require('jsonwebtoken')

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password)))
    throw { status: 401, message: 'Sai email hoặc mật khẩu' }

  if (user.isBanned) throw { status: 403, message: 'Tài khoản bị khóa' }

  user.lastLoginAt = new Date()
  user.lastActiveAt = new Date()
  await user.save()

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  return { token, user }
}
module.exports = { login }
