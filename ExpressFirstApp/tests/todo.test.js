const request = require('supertest');
const fs = require('fs');
const { app, startServer } = require('../index');
const HttpStatusCodes = require('../constants/httpStatusCodes');

let server;

beforeAll((done) => {
  server = startServer();
  done();
});

afterAll((done) => {
  server.close(done);
});

const todoName = 'testTodo';
const todoContent = {
  tasks: [
    { id: '1', task: 'Test Task' },
    { id: '2', task: 'Second Test Task' },
  ],
};
const todoFilePath = `./todo/${todoName}.json`;

beforeEach((done) => {
  fs.writeFile(todoFilePath, JSON.stringify(todoContent), (err) => {
    if (err) {
      console.error(err);
    }
    done();
  });
});

afterEach((done) => {
  fs.unlink(todoFilePath, (err) => {
    if (err) {
      console.error(err);
    }
    done();
  });
});

describe('GET /todo', () => {
  it('should get the content from the file', async () => {
    const response = await request(app).get('/todo').query({ todoName });
    expect(response.status).toBe(HttpStatusCodes.OK);
    expect(response.body).toStrictEqual(todoContent);
  });

  it('should return 400 if todoName is missing', async () => {
    const response = await request(app).get('/todo').query({});
    expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(response.text).toBe('Missing required field "todoName"');
  });
});

describe('POST /todo', () => {
  it('should append a task to an existing todo file', async () => {
    const newTask = { id: '3', task: 'Another Test Task' };

    const response = await request(app).post('/todo').send({
      todoName,
      id: newTask.id,
      task: newTask.task,
    });

    expect(response.status).toBe(HttpStatusCodes.OK);

    const fileData = await fs.promises.readFile(todoFilePath, 'utf-8');
    const todos = JSON.parse(fileData);
    expect(todos.tasks).toContainEqual(todoContent.tasks[0]);
    expect(todos.tasks).toContainEqual(newTask);
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app).post('/todo').send({});
    expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(response.text).toBe('Missing required fields');
  });

  it('should create a new todo file if it does not exist', async () => {
    await fs.promises.unlink(todoFilePath);

    const newTask = { id: '1', task: 'First Task in New File' };

    const response = await request(app).post('/todo').send({
      todoName,
      id: newTask.id,
      task: newTask.task,
    });

    expect(response.status).toBe(HttpStatusCodes.OK);

    const fileData = await fs.promises.readFile(todoFilePath, 'utf-8');
    const todos = JSON.parse(fileData);
    expect(todos.tasks).toContainEqual(newTask);
  });
});

describe('DELETE /todo', () => {
  it('should throw an error reading the file due to mock of fs.readFile', async () => {
    const spyOnReadFile = jest.spyOn(fs, 'readFile').mockImplementation((path, encoding, callback) => {
      callback(new Error('Could not read the file content.'))
    });
    
    const taskIdToDelete = '1';

    const response = await request(app)
      .delete('/todo')
      .send({ todoName, id: taskIdToDelete });

    expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.error.text).toBe('Could not read the file content.');
    expect(spyOnReadFile).toHaveBeenCalled();

    spyOnReadFile.mockRestore();
  });

  it('should delete a task by given todoName and id', async () => {
    const taskIdToDelete = '1';

    const response = await request(app)
      .delete('/todo')
      .send({ todoName, id: taskIdToDelete });

    expect(response.status).toBe(HttpStatusCodes.OK);

    const fileData = await fs.promises.readFile(todoFilePath, 'utf-8');
    const todos = JSON.parse(fileData);
    expect(todos.tasks).not.toEqual({
      id: taskIdToDelete,
      task: 'Test Task',
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app).delete('/todo').send({});
    expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(response.text).toBe('Missing required fields');
  });
});
