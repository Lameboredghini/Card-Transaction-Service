import request from 'supertest';
import app from '../../src/app';

const baseUrl = '/api/transactions';
const email = `divyam+txnlogic+${Date.now()}@gmail.com`;
let cardId: string;
const xUserId = 'divyam';

let transactionId: string;
describe('TransactionService - Business Logic (Integration)', () => {
  beforeAll(async () => {
    // Create User
    await request(app).post('/api/users/create').set('x-user-id', xUserId).send({ email, name: 'Test User' });

    // Create Card
    const cardResponse = await request(app).post('/api/cards/create').set('x-user-id', xUserId).send({
      email,
      expirationDate: '2099-12-31',
      cardLimit: 2000,
      cardCategory: 'VISA',
    });
    cardId = cardResponse.body.properties?.id;
    expect(cardId).toBeDefined();
  });

  describe('Balance Check - createTransaction', () => {
    it('should fail debit transaction due to insufficient balance', async () => {
      const response = await request(app).post(`${baseUrl}/create`).set('x-user-id', xUserId).send({
        email,
        cardId,
        transactionType: 'debit',
        amount: 999999,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/Insufficient balance/);
    });

    it('should pass a credit transaction', async () => {
      const response = await request(app).post(`${baseUrl}/create`).set('x-user-id', xUserId).send({
        email,
        cardId,
        transactionType: 'credit',
        amount: 100,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactionId');
      transactionId = response.body.transactionId;
    });
  });

  describe('Status Validation - updateTransactionStatus', () => {
    it('should fail on invalid status value', async () => {
      const response = await request(app).post(`${baseUrl}/update`).set('x-user-id', xUserId).send({
        email,
        transactionId,
        status: 'unknownStatus',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/Invalid status/);
    });

    it('should allow updating status to refunded', async () => {
      const response = await request(app).post(`${baseUrl}/update`).set('x-user-id', xUserId).send({
        email,
        transactionId,
        status: 'refunded',
      });

      expect(response.status).toBe(200);
      expect(response.body.transactionId).toBe(transactionId);
    });
  });

  describe('Delete Validation - deletePendingTransaction', () => {
    it('should not delete a non-pending transaction', async () => {
      const response = await request(app).post(`${baseUrl}/delete`).set('x-user-id', xUserId).send({
        email,
        transactionId,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/not pending/);
    });
  });
});
