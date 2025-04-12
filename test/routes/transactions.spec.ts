import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();
import app from '../../src/app';

describe('Transaction API Endpoints', () => {
  const email = 'divyam+test+1744468187130@gmail.com';
  let cardId: string;
  let transactionId: string;

  beforeAll(async () => {
    // Create user
    await request(app).post('/api/users/create').set('x-user-id', 'divyam').send({ email, name: 'test user for transactions' });

    // Create card
    const cardResponse = await request(app).post('/api/cards/create').set('x-user-id', 'divyam').send({
      email,
      cardCategory: 'VISA',
      expirationDate: '2099-12-31',
      cardLimit: 10000,
    });

    cardId = cardResponse.body.properties?.id;
    expect(cardId).toBeDefined();
  });

  describe('POST /transactions/create', () => {
    it('should create a transaction successfully', async () => {
      const response = await request(app).post('/api/transactions/create').set('x-user-id', 'divyam').send({
        email,
        cardId,
        transactionType: 'debit',
        amount: 1000,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactionId');
      expect(response.body).toHaveProperty('updatedBalance');

      transactionId = response.body.transactionId;
    });
  });

  describe('POST /transactions/update', () => {
    it('should update transaction status', async () => {
      const response = await request(app).post('/api/transactions/update').set('x-user-id', 'divyam').send({
        email,
        transactionId,
        status: 'refunded',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactionId', transactionId);
      expect(response.body.properties).toHaveProperty('status', 'refunded');
    });
  });

  describe('POST /transactions/delete', () => {
    it('should fail to delete non-pending transaction', async () => {
      const response = await request(app).post('/api/transactions/delete').set('x-user-id', 'divyam').send({
        email,
        transactionId,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /transaction', () => {
    it('should get single transaction', async () => {
      const response = await request(app).get('/api/transaction').set('x-user-id', 'divyam').query({
        email,
        transactionId,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', transactionId);
    });
  });

  describe('GET /transactions/', () => {
    it('should get list of transactions', async () => {
      const response = await request(app)
        .get('/api/transactions/')
        .set('x-user-id', 'divyam')
        .query({
          email,
          cardId,
          type: 'debit',
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // last 7 days
          endDate: new Date().toISOString(),
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.transactions)).toBe(true);
    });
  });
});
