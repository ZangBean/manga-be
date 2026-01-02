const errorHandler = (err, req, res, next) => {
  let statusCode = 500
  let message = 'Internal Server Error'

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Invalid input data'
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  } else if (err.code === 11000) {
    statusCode = 409
    message = 'Duplicate entry'
  } else if (err.message?.includes('không tồn tại')) {
    statusCode = 404
    message = err.message
  } else if (err.message?.includes('quyền')) {
    statusCode = 403
    message = err.message
  }

  // Log detailed error for debugging
  console.error(`[${new Date().toISOString()}] ${err.stack}`)

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? message : err.message,
  })
}

export default errorHandler
