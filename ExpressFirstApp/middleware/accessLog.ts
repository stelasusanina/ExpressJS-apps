import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Middleware to log access details

const logDir: string = './logs';

const accessLogger = (req: Request, res: Response, next: NextFunction): void => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  res.on('finish', () => {
    const log = `url="${req.url}" method="${req.method}" statusCode="${res.statusCode}" protocol="${req.protocol}" ip="${req.ip}"\n`;

    fs.appendFile(`${logDir}/accessLog.txt`, log, (err) => {
      if (err) {
        throw err;
      }
    });
  });

  next();
};

export default accessLogger;
