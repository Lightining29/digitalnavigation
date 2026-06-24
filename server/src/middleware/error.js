// Central error handler — returns consistent JSON errors.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message || 'Something went wrong.';

  if (status >= 500) {
    console.error('[error]', err);
  }

  res.status(status).json({ error: message });
}

// 404 handler for unmatched routes
export function notFound(_req, res) {
  res.status(404).json({ error: 'Resource not found.' });
}
