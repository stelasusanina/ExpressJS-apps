import express, { Request, Response } from 'express'
import fs from 'fs';
import HttpStatusCodes from '../constants/httpStatusCodes';
import ToDo from '../interfaces/todo';
import ToDoList from '../interfaces/todoList';
const router = express.Router();

//Creating new todo files or appending to already created
router.post('/todo', (req: Request, res: Response): void => {
  const { todoName, id, task }: ToDo = req.body;

  const newTodo: ToDo = {
    id,
    task,
  };

  let todos: ToDoList = { tasks: [] };

  if (!todoName || !id || !task) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send('Missing required fields');
    return;
  }

  // Read the existing JSON file
  fs.readFile(`./todo/${todoName}.json`, 'utf-8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('File does not exist, creating a new one.');
      } else {
        console.error(err);
        res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .send('Could not read the file content.');
      }
    } else {
      todos = JSON.parse(data);
    }

    todos.tasks.push(newTodo);

    fs.writeFile(`./todo/${todoName}.json`, JSON.stringify(todos), (err) => {
      if (err) {
        console.error(err);
        return res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .send('Failed to write to the file');
      }

      res.sendStatus(HttpStatusCodes.OK);
    });
  });
});

//Getting the content from to do lists
router.get('/todo', (req: Request, res: Response): void => {
    const { todoName } = req.query;
  
    if (!todoName) {
        res
        .status(HttpStatusCodes.BAD_REQUEST)
        .send('Missing required field "todoName"');
    }
  
    fs.readFile(`./todo/${todoName}.json`, 'utf-8', (err, data) => {
      if (err) {
        console.error(err.message);
        return res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .send('Could not read the file content.');
      } else {
        console.log(`${todoName}: `);
        console.log(JSON.parse(data));
  
        res.send(JSON.parse(data));
      }
    });
  });


//Deleting tasks
router.delete('/todo', (req, res): void => {
  const { todoName, id }: ToDo = req.body;

  let todos: ToDoList = { tasks: [] };

  if (!todoName || !id) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send('Missing required fields');
    return;
  }

  fs.readFile(`./todo/${todoName}.json`, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .send('Could not read the file content.');
    } else {
      todos = JSON.parse(data);
    }

    todos.tasks = todos.tasks.filter((t) => t.id !== id);

    //Deleting the file if there are no tasks left
    if (todos.tasks.length === 0) {
      fs.unlink(`./todo/${todoName}.json`, (err) => {
        if (err) {
          console.error(err);
          return res
            .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
            .send('Could not delete the file content.');
        } else {
          return res
            .status(HttpStatusCodes.NO_CONTENT)
            .send(
              `./todo/${todoName}.json was deleted because there are no tasks left`
            );
        }
      });
    } else {
      fs.writeFile(`./todo/${todoName}.json`, JSON.stringify(todos), (err) => {
        if (err) {
          console.error(err);
          return res
            .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
            .send('Failed to write to the file');
        }

        res.sendStatus(HttpStatusCodes.OK);
      });
    }
  });
});

export default router;