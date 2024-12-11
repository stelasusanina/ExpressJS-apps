import { app, startServer } from '../index';
import request, { Response } from 'supertest';
import fs from 'fs';
import HttpStatusCodes from '../constants/httpStatusCodes';
import { Server } from 'http';

const logFile: string = './logs/requestsDuration.txt';
let server: Server;

describe('Duration logger middleware', () => {
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
    fs.unlink(logFile, (err) => {
      if (err) {
        console.error(err);
      }
      done();
    });
    
    server.closeAllConnections();
  });

  it('should log request duration in the right format', async () => {
    const response: Response = await request(app).get('/index.html');

    expect(response.status).toBe(HttpStatusCodes.OK);

    const data: string = await fs.promises.readFile(logFile, 'utf-8');
    const logEntries: string[] = data.split('\n');

    const logEntry: string = logEntries[logEntries.length - 2];

    expect(logEntry).toMatch(/Request URL: \/index.html, Duration: \d+ms/);
  });
});
