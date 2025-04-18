'use strict';

import express, { Request, Response } from 'express';
import { getDailyList, getPracticeList } from './api';
import cors from 'cors';

const app = express();
const port = 3001;

const corsOptions = {
  origin: 'https://sort-them-all.jlopes.dev',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get('/daily', async (req: Request, res: Response) => {
  const list = await getDailyList();
  // console.log(JSON.stringify(list));
  res.send(list);
});

app.get('/practice', async (req: Request, res: Response) => {
  const list = await getPracticeList();
  // console.log(JSON.stringify(list));
  res.send(list);
});

app.get('/practice/gen/:gen', async (req: Request, res: Response) => {
  const gen = parseInt(req.params.gen);
  const list = await getPracticeList(gen);
  // console.log(JSON.stringify(list));
  res.send(list);
});

app.get('/health', async (req: Request, res: Response) => {
  res.send('ok');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
