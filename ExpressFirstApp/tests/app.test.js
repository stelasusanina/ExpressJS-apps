const request = require('supertest');
const app = require('../index');
const fs = require('fs');
const HttpStatusCodes = require('../constants/httpStatusCodes');

describe('routes', () => {
  it('should respond with the index.html', async () => {
    const response = await request(app).get('/index.html');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=UTF-8');

    const expectedHtml = `<html>
  <body>
    <h1>Hello from index.html</h1>
  </body>
</html>`;

    expect(response.text.trim()).toBe(expectedHtml.trim());
  });

  it('should respond with the data.json', async () => {
    const response = await request(app).get('/data.json');
    expect(response.status).toBe(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=UTF-8'
    );

    expect(JSON.parse(response.text)).toStrictEqual({
      message: 'Hello from data.json!',
    });
  });

  it('should respond with the catsVsDogs.html', async () => {
    const response = await request(app).get('/catsVsDogs.html');
    expect(response.status).toBe(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toBe('text/html; charset=UTF-8');

    const expectedHtml = fs.readFileSync(
      './public/catsVsDogs.html',
      'utf-8',
      (err) => {
        if (err) {
          console.error(err);
          return response
            .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
            .send('Failed to read the file');
        }
      }
    );

    expect(response.text.trim()).toBe(expectedHtml.trim());
  });

  it('should respond with the notFoundErrorPage.html', async () => {
    const response = await request(app).get('/abc');
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

    const expectedHtml = `<!doctype html>
<html lang="en">
  <body>
    <div>
      <h1><b>404</b></h1>
      <p>Page not found</p>
    </div>
  </body>
</html>`;

    expect(response.text.trim()).toBe(expectedHtml.trim());
  });
});
