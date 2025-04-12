import request from 'supertest';
import app from '../../src/app';

const baseUrl = '/api/transactions';
const xUserId = 'divyam';
const email = `divyam+txnedgecase+${Date.now()}@gmail.com`;

let cardId: string;
let approvedTransactionId: string;

describe('TransactionService - Edge Cases (Integration)', () => {
  beforeAll(async () => {
    // Create User
    await request(app).post('/api/users/create').set('x-user-id', xUserId).send({ email, name: 'Edge Tester' });

    // Create Card
    const cardRes = await request(app).post('/api/cards/create').set('x-user-id', xUserId).send({
      email,
      expirationDate: '2099-12-31',
      cardLimit: 1000,
      cardCategory: 'VISA',
    });

    cardId = cardRes.body.properties?.id;
    expect(cardId).toBeDefined();

    // Create an approved transaction for delete test
    const txnRes = await request(app).post(`${baseUrl}/create`).set('x-user-id', xUserId).send({
      email,
      cardId,
      transactionType: 'credit',
      amount: 100,
    });
    approvedTransactionId = txnRes.body.transactionId;

    // Mark transaction as "approved"
    await request(app).post(`${baseUrl}/update`).set('x-user-id', xUserId).send({
      email,
      transactionId: approvedTransactionId,
      status: 'approved',
    });
  });

  it('should fail with invalid transaction type', async () => {
    const res = await request(app).post(`${baseUrl}/create`).set('x-user-id', xUserId).send({
      email,
      cardId,
      transactionType: 'INVALID_TYPE',
      amount: 10,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid transaction type/);
  });

  it('should fail deleting approved transaction', async () => {
    const res = await request(app).post(`${baseUrl}/delete`).set('x-user-id', xUserId).send({
      email,
      transactionId: approvedTransactionId,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/not pending/);
  });

  it('should fail when card does not exist', async () => {
    const res = await request(app).post(`${baseUrl}/create`).set('x-user-id', xUserId).send({
      email,
      cardId: 'non-existent-card-id',
      transactionType: 'credit',
      amount: 50,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Card does not exists/);
  });

  it('should fail getting a non-existent transaction', async () => {
    const res = await request(app).get(`/api/transaction`).set('x-user-id', xUserId).query({ transactionId: 'non-existent-id', email });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Transaction not found/);
  });
});
