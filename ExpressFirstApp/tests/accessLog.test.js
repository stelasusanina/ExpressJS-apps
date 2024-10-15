const app = require('../index');
const request = require('supertest');
const fs = require('fs');
const accessLogger = require('../middleware/accessLog');
const HttpStatusCodes = require('../constants/httpStatusCodes');

app.use(accessLogger);
app.get('/index.html', (req, res) => {
  res.sendStatus(200);
});

describe('Access logger middleware', () => {
  const logFile = './logs/accessLog-test.txt';

  beforeAll((done) => {
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
  });

  it('should log access log in the right format', async () => {
    const response = await request(app).get('/index.html');

    expect(response.status).toBe(HttpStatusCodes.OK);

    fs.readFile(logFile, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
      }
      const logEntries = data.split('\n');

      const logEntry = logEntries.find((entry) =>
        entry.includes('/index.html')
      );

      expect(logEntry).toMatch(
        /url="\/index.html" method="GET" statusCode="200" protocol="HTTP\/1\.1" ip="::ffff:127\.0\.0\.1"/
      );
    });
  });
});
