import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();
import app from '../src/app';

const baseUrl = '/api/transactions';
const xUserId = 'divyam';
const email = `divyam+flow+${Date.now()}@gmail.com`;

let cardId: string;
let transactionId: string;

describe('TransactionService - Full Flow (Integration)', () => {
  it('should run a full transaction lifecycle (create → get → update → delete)', async () => {
    // Step 1: Create User
    const userRes = await request(app).post('/api/users/create').set('x-user-id', xUserId).send({ email, name: 'Flow User' });

    expect(userRes.status).toBe(200);
    expect(userRes.body.message).toBe('User created successfully');

    // Step 2: Create Card
    const cardRes = await request(app).post('/api/cards/create').set('x-user-id', xUserId).send({
      email,
      expirationDate: '2099-12-31',
      cardLimit: 500,
      cardCategory: 'MASTERCARD',
    });

    expect(cardRes.status).toBe(200);
    cardId = cardRes.body.properties?.id;
    expect(cardId).toBeDefined();

    // Step 3: Create Transaction
    const txnRes = await request(app).post(`${baseUrl}/create`).set('x-user-id', xUserId).send({
      email,
      cardId,
      transactionType: 'credit',
      amount: 50,
    });

    expect(txnRes.status).toBe(200);
    transactionId = txnRes.body.transactionId;
    expect(transactionId).toBeDefined();

    // Step 4: Get Transaction
    const getTxnRes = await request(app).get('/api/transaction').set('x-user-id', xUserId).query({ transactionId, email });

    expect(getTxnRes.status).toBe(200);
    expect(getTxnRes.body).toHaveProperty('id', transactionId);

    // Step 5: Update Transaction Status to "pending"
    const updateRes = await request(app).post(`${baseUrl}/update`).set('x-user-id', xUserId).send({
      email,
      transactionId,
      status: 'pending',
    });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.transactionId).toBe(transactionId);

    // Step 6: Delete Transaction
    const deleteRes = await request(app).post(`${baseUrl}/delete`).set('x-user-id', xUserId).send({
      email,
      transactionId,
    });

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.transactionId).toBe(transactionId);
    expect(deleteRes.body.message).toMatch(/Transaction deleted successfully/);
  });
});
