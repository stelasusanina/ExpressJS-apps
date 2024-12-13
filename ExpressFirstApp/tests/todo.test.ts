import request, { Response } from 'supertest';
import fs from 'fs';
import { app, startServer } from '../index';
import HttpStatusCodes from '../constants/httpStatusCodes';
import { Server } from 'http';
import ToDoList from '../interfaces/todoList';
import ToDo from '../interfaces/todo';
import os from 'os';

let server: Server;

beforeAll((done) => {
  server = startServer();
  done();
});

afterAll((done) => {
  server.close();
  done();
});

const todoName: string = 'testTodo';

const todoContent: ToDoList = {
  tasks: [
    { id: 1, task: 'Test Task' },
    { id: 2, task: 'Second Test Task' },
  ],
};
const todoFilePath: string = `./todo/${todoName}.json`;

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
    const response: Response = await request(app).get('/todo').query({ todoName });
    expect(response.status).toBe(HttpStatusCodes.OK);
    expect(response.body).toStrictEqual(todoContent);
  });

  it('should return 400 if todoName is missing', async () => {
    const response: Response = await request(app).get('/todo').query({});
    expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(response.text).toBe('Missing required field "todoName"');
  });
});

describe('POST /todo', () => {
  it('should append a task to an existing todo file', async () => {
    const newTask: ToDo = { id: 3, task: 'Another Test Task' };

    const response: Response = await request(app).post('/todo').send({
      todoName,
      id: newTask.id,
      task: newTask.task,
    });

    expect(response.status).toBe(HttpStatusCodes.OK);

    const fileData: string = await fs.promises.readFile(todoFilePath, 'utf-8');
    const todos: ToDoList = JSON.parse(fileData);
    expect(todos.tasks).toContainEqual(todoContent.tasks[0]);
    expect(todos.tasks).toContainEqual(newTask);
  });

  it('should return 400 if required fields are missing', async () => {
    const response: Response = await request(app).post('/todo').send({});
    expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(response.text).toBe('Missing required fields');
  });

  it('should create a new todo file if it does not exist', async () => {
    const newTask: ToDo = { id: 1, task: 'First Task in New File' };

    const response: Response = await request(app).post('/todo').send({
      todoName,
      id: newTask.id,
      task: newTask.task,
    });

    expect(response.status).toBe(HttpStatusCodes.OK);

    const fileData: string = await fs.promises.readFile(todoFilePath, 'utf-8');
    const todos: ToDoList = JSON.parse(fileData);
    expect(todos.tasks).toContainEqual(newTask);
  });
});

describe('DELETE /todo', () => {
  it('should throw an error while trying to delete tasks', async () => {
    const spyOnReadFile = jest.spyOn(fs, 'readFile').mockImplementation((path, callback) => {
      callback(new Error('Could not read the file content.'), Buffer.alloc(0));
    });

    const taskIdToDelete = '1';

    const response = await request(app)
      .delete('/todo')
      .send({ todoName, id: taskIdToDelete });

    expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.text).toBe('Could not read the file content.');
    expect(fs.readFile).toHaveBeenCalled();

    spyOnReadFile.mockRestore();
  });

  it('should successfully delete a task by given todoName and id', async () => {
    const toDoListContent = JSON.stringify({
      tasks: [
        { "id": 1, "task": "Task 1" },
        { "id": 2, "task": "Task 2" },
        { "id": 3, "task": "Task 3" }
      ]
    });

    const taskIdToDelete: number = 1;

    const spyOnReadFile = jest
    .spyOn(fs, 'readFile')
    .mockImplementation((path, callback) => {
      callback(null, Buffer.from(toDoListContent));
    });

      const spyOnWriteFile = jest
      .spyOn(fs, 'writeFile')
      .mockImplementation((filePath, data, callback) => {
        if (callback && typeof callback === 'function') {
          callback(null);
        }
      });

    const response = await request(app)
      .delete('/todo')
      .send({ todoName: 'testTodo', id: taskIdToDelete });

    expect(response.statusCode).toBe(HttpStatusCodes.OK);
    expect(spyOnReadFile).toHaveBeenCalled();
    expect(spyOnWriteFile).toHaveBeenCalled();

    if (os.platform() === 'win32') {
      expect(spyOnWriteFile).toHaveBeenCalledTimes(3);
    } else if (os.platform() === 'darwin') {
      expect(spyOnWriteFile).toHaveBeenCalledTimes(1);
    }

    spyOnReadFile.mockRestore();
    spyOnWriteFile.mockRestore();
  });

  it('should delete a task by given todoName and id', async () => {
    const taskIdToDelete: number = 1;

    const response = await request(app)
      .delete('/todo')
      .send({ todoName, id: taskIdToDelete });

    expect(response.status).toBe(HttpStatusCodes.OK);

    const fileData: string = await fs.promises.readFile(todoFilePath, 'utf-8');
    const todos: ToDoList = JSON.parse(fileData);
    expect(todos.tasks).not.toEqual({
      id: taskIdToDelete,
      task: 'Test Task',
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const response: Response = await request(app).delete('/todo').send({});
    expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(response.text).toBe('Missing required fields');
  });
});
