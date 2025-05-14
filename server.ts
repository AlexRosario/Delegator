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

app.get('/api/house-roll-call/:rollId/:year', async (req, res) => {
  const { rollId, year } = req.params;
  const url = `https://clerk.house.gov/evs/${year}/roll${rollId}.xml`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).send(`Failed: ${response.statusText}`);
    }

    const xml = await response.text();
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error fetching House roll call:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get(
  '/api/senate-roll-call/:rollId/:congress/:session',
  async (req, res) => {
    const { rollId, congress, session } = req.params;
    const paddedRoll = rollId.toString().padStart(5, '0');
    const url = `https://www.senate.gov/legislative/LIS/roll_call_votes/vote${congress}${session}/vote_${congress}_${session}_${paddedRoll}.xml`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return res
          .status(response.status)
          .send(`Failed: ${response.statusText}`);
      }

      const xml = await response.text();
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error('Error fetching Senate roll call:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

app.use(authController);
app.use(voteController);

app.listen(3000, () => {
  console.log('🚀 Server is running on port 3000');
});
