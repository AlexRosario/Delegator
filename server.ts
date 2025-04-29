import express from 'express';
import cors from 'cors';

import { authController } from './src/router/auth.router';
import { voteController } from './src/router/vote.router';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('API is live');
});

app.use(authController);
app.use(voteController);

app.listen(3000, () => {
  console.log('🚀 Server is running on port 3000');
});
