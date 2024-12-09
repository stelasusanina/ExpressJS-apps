import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

//Middleware calculating the request duration and logs the info to a file

const logDir: string = './logs';

const durationLogger = (req: Request, res: Response, next: NextFunction): void => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const start: number = Date.now();

  res.on('finish', () => {
    const duration: number = Date.now() - start;
    const logMessage: string = `Request URL: ${req.url}, Duration: ${duration}ms\n`;

    fs.appendFile('./logs/requestsDuration.txt', logMessage, (err) => {
      if (err) {
        throw err;
      }
    });
  });

  next();
};

export default durationLogger;