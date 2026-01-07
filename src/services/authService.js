import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { ROLE_HIERARCHY } from '../constants/index.js'

export const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password)))
    throw { status: 401, message: 'Sai email hoặc mật khẩu' }

  if (user.isBanned) throw { status: 403, message: 'Tài khoản bị khóa' }

  user.lastLoginAt = new Date()
  user.lastActiveAt = new Date()
  await user.save()

  const payload = {
    id: user._id,
    role: user.role,
    permissions: ROLE_HIERARCHY[user.role] || ['user'],
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })

  return {
    token,
    user: payload,
  }
}
