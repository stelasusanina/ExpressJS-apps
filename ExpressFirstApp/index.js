const express = require('express');
const staticRoutes = require('./routes/staticRoutes');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const accessLog = require('access-log');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const staticDirectory = process.env.STATIC_DIRECTORY || 'public';
const port = process.env.PORT;

var format =
  'url=":url" method=":method" statusCode=":statusCode" protocol=":protocol" ip=":ip"\n';

// Middleware to log access details
app.use((req, res, next) => {
  accessLog(req, res, format, (log) => {
    fs.appendFile('accessLog.txt', log, (err) => {
      if (err) {
        throw err;
      }
    });
  });

  next();
});

//Middleware calculating the request duration and logs the info to a file
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `Request URL: ${req.url}, Duration: ${duration}ms\n`;

    fs.appendFile('requestsDuration.txt', logMessage, (err) => {
      if (err) {
        throw err;
      }
    });
  });

  next();
});

const corsOptionsHTML = {
  origin: 'http://localhost:3000',
};

const corsOptionsJSON = {
  origin: '*',
};

// Middleware to dynamically set the Content-Type and CORS headers based on file type
app.use((req, res, next) => {
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
});

app.use('/static', express.static(staticDirectory));
app.use('/static', staticRoutes);

app.get('/', (req, res) => {
  res.send('Hi');
});

app.use((req, res) => {
  res
    .status(404)
    .sendFile('public/notFoundErrorPage.html', { root: __dirname });
});

app.listen(port, (err) => {
  if (err) {
    console.log('This port is already being used!');
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});

module.exports = app;
