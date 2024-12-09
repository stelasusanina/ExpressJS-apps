const { app, startServer } = require('../index');
const request = require('supertest');
const fs = require('fs');
const HttpStatusCodes = require('../constants/httpStatusCodes');

const logFile = './logs/accessLog.txt';
let server;

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
    const response = await request(app).get('/index.html');

    expect(response.status).toBe(HttpStatusCodes.OK);

    const data = await fs.promises.readFile(logFile, 'utf-8');
    const logEntries = data.split('\n');

    const logEntry = logEntries[logEntries.length - 2];

    expect(logEntry).toMatch(
      'url="/index.html" method="GET" statusCode="200" protocol="HTTP" ip="::ffff:127.0.0.1"'
    );
  });
});
