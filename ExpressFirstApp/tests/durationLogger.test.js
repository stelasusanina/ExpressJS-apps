const { app, startServer } = require('../index');
const request = require('supertest');
const fs = require('fs');
const HttpStatusCodes = require('../constants/httpStatusCodes');

const logFile = './logs/requestsDuration.txt';
let server;

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
    server.close(() => {
      fs.unlink(logFile, (err) => {
        if (err) {
          console.error(err);
        }
        done();
      });
    });
  });

  it('should log request duration in the right format', async () => {
    const response = await request(app).get('/index.html');

    expect(response.status).toBe(HttpStatusCodes.OK);

    const data = await fs.promises.readFile(logFile, 'utf-8');
    const logEntries = data.split('\n');

    const logEntry = logEntries[logEntries.length - 2];

    expect(logEntry).toMatch(/Request URL: \/index.html, Duration: \d+ms/);
  });
});
