const request = require('supertest');
const app = require('../index');

describe('routes', () => {
  it('should respond with "Hi"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hi');
  });

  it('should respond with the index.html', async () => {
    const response = await request(app).get('/static/index.html');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html');

    const expectedHtml = `<html>
  <body>
    <h1>Hello from index.html</h1>
  </body>
</html>`;

    expect(response.text.trim()).toBe(expectedHtml.trim());
  });

  it('should respond with the data.json', async () => {
    const response = await request(app).get('/static/data.json');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/json');

    expect(JSON.parse(response.text)).toStrictEqual({
      message: 'Hello from data.json!',
    });
  });

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

describe('CORS tests', () => {
  it('the Access-Control-Allow-Origin should be * for JSON files', async () => {
    const response = await request(app).get('/static/data.json');
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  it('the Access-Control-Allow-Origin should be * for HTML files', async () => {
    const response = await request(app).get('/static/index.html');
    expect(response.headers['access-control-allow-origin']).toBe(
      'http://localhost:3000'
    );
  });
});
