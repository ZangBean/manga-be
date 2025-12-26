const jwt = require('jsonwebtoken')

exports.optionalAuth = (req, res, next) => {
  const token = req.cookies?.access_token
  if (!token) {
    req.user = null // chưa login
    return next()
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    req.user = null
  }
  next()
}
