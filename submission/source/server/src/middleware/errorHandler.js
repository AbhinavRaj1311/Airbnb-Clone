/**
 * Error handling middleware for Express
 */
export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${err.stack || err.message}`)

  const statusCode = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

/**
 * 404 handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
  })
}
