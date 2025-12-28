const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) => {
  const token = req.cookies?.access_token
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

exports.optionalAuth = (req, res, next) => {
  const token = req.cookies?.access_token
  if (!token) {
    req.user = null
    return next()
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    req.user = null
  }
  next()
}
