const express = require('express');
const dotenv = require('dotenv');
const accessLogger = require('./middleware/accessLog');
const corsMiddleware = require('./middleware/maintainCors');
const durationLogger = require('./middleware/requestDuration');
const bodyParser = require('body-parser');
const fs = require('fs');

dotenv.config();
const app = express();

const staticDirectory = process.env.STATIC_DIRECTORY || 'public';
const port = process.env.PORT;

app.use(express.static(staticDirectory));

// Use middleware
app.use(accessLogger);
app.use(durationLogger);
app.use(corsMiddleware);
app.use(bodyParser.json());

//Creating new todo files or appending to already created
app.post('/todo', (req, res) => {
  const { todoName, id, task } = req.body;
  const log = `${id}. ${task} \n`;

  fs.appendFile(`./todo/${todoName}.txt`, log, (err) => {
    if (err) {
      throw err;
    }
  });
});

//Getting the content from to do lists
app.get('/todo', (req, res) => {
  const { todoName } = req.body;

  fs.readFile(`./todo/${todoName}.txt`, 'utf-8', (err, data) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`${todoName}: `);
      console.log(data);
    }
  });
});

//Deleting tasks
app.delete('/todo', (req, res) => {
  const { todoName, id } = req.body;

  //1. Reading the whole content
  fs.readFile(`./todo/${todoName}.txt`, 'utf-8', (err, data) => {
    if (err) {
      console.error(err.message);
    } else {
      //2. Filtering the lines to be removed
      const lines = data.split('\n');
      const filteredLines = lines.filter((line) => !line.startsWith(`${id}.`));
      const updatedData = filteredLines.join('\n');

      //3. Deleting the whole file
      fs.unlink(`./todo/${todoName}.txt`, (err) => {
        if (err) {
          throw err;
        }
        console.log('File deleted!');
      });

      //4. Creating the file once again only with the filtered content
      fs.appendFile(`./todo/${todoName}.txt`, updatedData, (err) => {
        if (err) {
          throw err;
        }
      });

      console.log(`${todoName}: `);
      console.log(data);
    }
  });
});

app.use((req, res) => {
  res
    .status(404)
    .sendFile('public/notFoundErrorPage.html', { root: __dirname });
});

app.listen(port, (err) => {
  if (err) {
    console.log('This port is already being used!');
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});

module.exports = app;
