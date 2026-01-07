import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
  const token = req.cookies?.access_token
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export const optionalAuth = (req, res, next) => {
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

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const userRole = req.user.role
    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Insufficient permissions' })
    }

    next()
  }
}
