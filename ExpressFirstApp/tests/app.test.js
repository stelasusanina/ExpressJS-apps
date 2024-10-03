const request = require('supertest');
const app = require('../index');

describe('GET /', () => {
  it('should respond with "Hi"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hi');
  });
});

describe('GET /static/index.html', () => {
  it('should respond with the index.html', async () => {
    const response = await request(app).get('/static/index.html');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=UTF-8');

    const expectedHtml = `<html>
  <body>
    <h1>Hello from index.html</h1>
  </body>
</html>`;

    expect(response.text.trim()).toBe(expectedHtml.trim());
  });
});

describe('GET /static/data.json', () => {
  it('should respond with the data.json', async () => {
    const response = await request(app).get('/static/data.json');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=UTF-8'
    );

    expect(JSON.parse(response.text)).toStrictEqual({
      message: 'Hello from data.json!',
    });
  });
});

describe('GET /abc', () => {
  it('should respond with the notFoundErrorPage.html', async () => {
    const response = await request(app).get('/abc');
    expect(response.status).toBe(404);

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
