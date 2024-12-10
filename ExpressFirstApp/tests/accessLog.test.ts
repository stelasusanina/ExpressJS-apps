import { app, startServer } from '../index';
import request, { Response } from 'supertest';
import fs from 'fs';
import HttpStatusCodes from '../constants/httpStatusCodes';
import { Server } from 'http';

const logFile: string = './logs/accessLog.txt';
let server: Server;

describe('Access logger middleware', () => {
  beforeAll((done) => {
    server = startServer();
    fs.writeFile(logFile, '', (err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      fs.unlink(logFile, (err) => {
        if (err) {
          console.error(err);
        }
        done();
      });
    });
  });

  it('should log access log in the right format', async () => {
    const response: Response = await request(app).get('/index.html');

    expect(response.status).toBe(HttpStatusCodes.OK);

    const data: string = await fs.promises.readFile(logFile, 'utf-8');
    const logEntries: string[] = data.split('\n');

    const logEntry: string = logEntries[logEntries.length - 2];

    expect(logEntry).toMatch(
      'url="/index.html" method="GET" statusCode="200" protocol="http" ip="::ffff:127.0.0.1"'
    );
  });
});
