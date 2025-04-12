import express from 'express';
import { json, urlencoded } from 'express';

import dotenv from 'dotenv';

dotenv.config(); //load all config

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

import routes from './routes/index';
import rateLimiter from './middlewares/rateLimit';

app.use('/api', rateLimiter(1, 1), routes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Service is up and running!!!!!! Grab your coffee and start coding :)',
  });
});

export default app;
