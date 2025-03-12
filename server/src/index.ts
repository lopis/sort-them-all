'use strict';

import express, { Request, Response } from 'express';
import { getDailyList, getPracticeList } from './api';
import cors from 'cors';

const app = express();
const port = 3001;

const corsOptions = {
  origin: ['http://jlopes.dev', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get('/daily', async (req: Request, res: Response) => {
  res.send(await getDailyList());
});

app.get('/practice', async (req: Request, res: Response) => {
  res.send(await getPracticeList());
});

app.get('/practice/gen/:gen', async (req: Request, res: Response) => {
  const gen = parseInt(req.params.gen);
  res.send(await getPracticeList(gen));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
