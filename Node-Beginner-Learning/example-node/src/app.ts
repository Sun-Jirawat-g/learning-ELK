import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root: serve landing page (HTML)
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// group base path: /api/v1
app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
