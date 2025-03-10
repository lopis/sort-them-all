import express, { Request, Response } from 'express';
import { fetchFromAllPokemon } from './api';

const app = express();
const port = 3000;

app.get('/daily', async (req: Request, res: Response) => {
  res.send(await fetchFromAllPokemon());
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
