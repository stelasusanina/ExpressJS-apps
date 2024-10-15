const app = require('../index');
const request = require('supertest');
const fs = require('fs');
const durationLogger = require('../middleware/requestDuration');

app.use(durationLogger);
app.get('/index.html', (req, res) => {
  res.sendStatus(200);
});

describe('Duration logger middleware', () => {
  const logFile = './logs/requestDuration-test.txt';

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

  it('should log request duration in the right format', async () => {
    const response = await request(app).get('/index.html');

    expect(response.status).toBe(200);

    fs.readFile(logFile, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
      }
      const logEntries = data.split('\n');

      const logEntry = logEntries.find((entry) =>
        entry.includes('/index.html')
      );

      expect(logEntry).toMatch(/Request URL: \/index.html, Duration: \d+ms/);
    });
  });
});