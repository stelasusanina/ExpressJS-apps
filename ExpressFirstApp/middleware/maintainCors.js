const cors = require('cors');
const path = require('path');

// Middleware to dynamically set the Content-Type and CORS headers based on file type
const corsOptionsHTML = {
  origin: 'http://localhost:3000',
};

const corsOptionsJSON = {
  origin: '*',
};

const corsMiddleware = (req, res, next) => {
  const fileType = path.extname(req.path);

  switch (fileType) {
    case '.html':
      res.setHeader('Content-Type', 'text/html');
      cors(corsOptionsHTML)(req, res, next);
      break;
    case '.json':
      res.setHeader('Content-Type', 'application/json');
      cors(corsOptionsJSON)(req, res, next);
      break;
    default:
      break;
  }

  next();
};

module.exports = corsMiddleware;
