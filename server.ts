import express from 'express';
import cors from 'cors';
import { authController } from './src/router/auth.router';
import { voteController } from './src/router/vote.router';
import { repController } from './src/router/rep.router';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('API is live');
});

app.get('/api/house-roll-call/:rollId/:year', async (req, res) => {
  const { rollId, year } = req.params;
  const paddedRollId = rollId.toString().padStart(3, '0');
  const url = `https://clerk.house.gov/evs/${year}/roll${paddedRollId}.xml`;

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

app.get('/congressGov/*', async (req, res) => {
  const apiKey = process.env.API_KEY;
  const offset = req.query.offset;

  const targetUrl = `https://api.congress.gov/${req.params[0]}${
    offset ? `?offset=${offset}` : ''
  }`;

  if (!apiKey) throw new Error('Missing Congress.gov API key');
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'X-API-Key': apiKey
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching from Congress API:', err);
    res.status(500).send('Error from Congress API');
  }
});

app.get('/positionStack/*', async (req, res) => {
  const key = process.env.POSITIONSTACK_API_KEY;
  const query = req.url.split('?')[1];
  const targetUrl = `http://api.positionstack.com/v1/${req.params[0]}?access_key=${key}&${query}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('PositionStack error:', err);
    res.status(500).send('PositionStack error');
  }
});

app.get('/5Calls/*', async (req, res) => {
  const apiKey = process.env.FIVECALLS_API_KEY;

  const url = `https://api.5calls.org/v1/${req.params[0]}?${req.url.split('?')[1] || ''}`;
  if (!apiKey) throw new Error('Missing 5Calls API key');

  try {
    const response = await fetch(url, {
      headers: {
        'X-5Calls-Token': apiKey
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error from 5Calls API:', err);
    res.status(500).send('5Calls API error');
  }
});

app.use(authController);
app.use(voteController);
app.use(repController);

app.listen(3000, () => {
  console.log('🚀 Server is running on port 3000');
});
