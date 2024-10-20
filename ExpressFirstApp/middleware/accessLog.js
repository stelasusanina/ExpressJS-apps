const fs = require('fs');
const accessLog = require('access-log');

// Middleware to log access details
var format =
  'url=":url" method=":method" statusCode=":statusCode" protocol=":protocol" ip=":ip"\n';

const logDir = './logs';

const accessLogger = (req, res, next) => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true }); 
  }

  accessLog(req, res, format, (log) => {
    fs.appendFile('./logs/accessLog.txt', log, (err) => {
      if (err) {
        throw err;
      }
    });
  });

  next();
};

module.exports = accessLogger;
