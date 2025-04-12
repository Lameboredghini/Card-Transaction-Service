import express from 'express';
import { json, urlencoded } from 'express';

import dotenv from 'dotenv';

dotenv.config(); //load all config

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

import routes from './routes/index';
import rateLimiter from './middlewares/rateLimit';
import { jwtAuth } from './middlewares/jwtAuth';

app.use('/api', rateLimiter(1, 20), jwtAuth, routes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Service is up and running!!!!!! Grab your coffee and start coding :)',
  });
});

export default app;
