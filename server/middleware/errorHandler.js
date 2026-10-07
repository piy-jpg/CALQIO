/**
 * Global API Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('[API Error]:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
}

/**
 * 404 Not Found Handler for API Routes
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `API Route ${req.method} ${req.originalUrl} not found.`
  });
}
