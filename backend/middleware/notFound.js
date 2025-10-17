const path = require('path');
const fs = require('fs');

const notFound = (req, res, next) => {
  // If the request is for the API, propagate a 404 error as JSON
  if (req.originalUrl && req.originalUrl.startsWith('/api')) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    return next(error);
  }

  // For non-API routes, try to serve the frontend SPA index if it exists
  const indexPath = path.join(__dirname, '..', '..', 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.status(200).sendFile(indexPath);
  }

  // Fallback to default behavior
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFound;
