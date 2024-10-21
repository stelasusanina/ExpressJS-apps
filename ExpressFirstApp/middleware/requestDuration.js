const fs = require('fs');

//Middleware calculating the request duration and logs the info to a file

const logDir = './logs';

const durationLogger = (req, res, next) => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `Request URL: ${req.url}, Duration: ${duration}ms\n`;

    fs.appendFile('./logs/requestsDuration.txt', logMessage, (err) => {
      if (err) {
        throw err;
      }
    });
  });

  next();
};

module.exports = durationLogger;
