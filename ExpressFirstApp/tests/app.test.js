const request = require('supertest');
const app = require('../index');
const fs = require('fs').promises;
const HttpStatusCodes = require('../constants/httpStatusCodes');

describe('routes', () => {
  it('should respond with the index.html', async () => {
    const response = await request(app).get('/index.html');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=UTF-8');

    const expectedContent = await fs.readFile('./public/index.html', 'utf-8');
    expect(response.text.trim()).toBe(expectedContent.trim());
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

    const expectedHtml = await fs.readFile('./public/catsVsDogs.html', 'utf-8');
    expect(response.text.trim()).toBe(expectedHtml.trim());
  });

  it('should respond with the notFoundErrorPage.html', async () => {
    const response = await request(app).get('/abc');
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

    const expectedHtml = await fs.readFile(
      './public/notFoundErrorPage.html',
      'utf-8'
    );

    expect(response.text.trim()).toEqual(expectedHtml.trim());
  });
});
