import request, { Response } from 'supertest';
import { app, startServer } from '../index';
import { Server } from 'http';

let server: Server;

beforeAll((done) => {
  server = startServer();
  done();
});

afterAll((done) => {
  server.close();
  done();
});

describe('CORS tests', () => {
  it('the Access-Control-Allow-Origin should be * for JSON files', async () => {
    const response: Response = await request(app).get('/static/data.json');
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  it('the Access-Control-Allow-Origin should be * for HTML files', async () => {
    const response: Response = await request(app).get('/static/index.html');
    expect(response.headers['access-control-allow-origin']).toBe(
      'http://localhost:3000'
    );
  });
});
