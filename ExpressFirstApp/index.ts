import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import accessLogger from './middleware/accessLog';
import corsMiddleware from './middleware/maintainCors';
import durationLogger from './middleware/requestDuration';
import bodyParser from 'body-parser';
import todoRoutes from './routes/todo';
import HttpStatusCodes from './constants/httpStatusCodes';

const app = express();
dotenv.config();

const staticDirectory: string = process.env.STATIC_DIRECTORY || 'public';
const port: number = 3000;

//Use logging middleware
app.use(accessLogger);
app.use(durationLogger);

//Serve static files
app.use(express.static(staticDirectory));

//Use other middleware
app.use(corsMiddleware);
app.use(bodyParser.json());

//Use todoRoutes
app.use(todoRoutes);

app.use((req: Request, res: Response) => {
  res
    .status(HttpStatusCodes.NOT_FOUND)
    .sendFile('public/notFoundErrorPage.html', { root: __dirname });
});

//Function to start the server
const startServer = () => {
  const server = app.listen(port, (err?: any) => {
    if (err) {
      console.log('This port is already being used!');
      return;
    }
    console.log(`Server is running on http://localhost:${port}`);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

export { app, startServer };
