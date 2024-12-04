const request = require('supertest');
const { app, startServer } = require('../index');

let server;

beforeAll((done) => {
  server = startServer();
  done();
});

afterAll((done) => {
  server.close(done);
});

xdescribe('CORS tests', () => {
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
