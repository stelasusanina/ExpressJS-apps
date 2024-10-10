const express = require('express');
const dotenv = require('dotenv');
const accessLogger = require('./middleware/accessLog');
const corsMiddleware = require('./middleware/maintainCors');
const durationLogger = require('./middleware/requestDuration');

dotenv.config();
const app = express();

const staticDirectory = process.env.STATIC_DIRECTORY || 'public';
const port = process.env.PORT;

app.use(express.static(staticDirectory));

// Use middleware
app.use(accessLogger);
app.use(durationLogger);
app.use(corsMiddleware);

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
