import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();
import app from '../../src/app'; // Import your configured express app

// Test cards using a test user email
const testEmail = 'divyam+test+1744468187130@gmail.com';

describe('Card API Endpoints', () => {
  let cardId: string;

  // Use a new card number and parameters specific to your CardService/business rules
  const newCardData = {
    email: testEmail,
    cardLimit: 1000,
    cardCategory: 'VISA', // Make sure this is a valid CardCategory
    cardType: 'GOLD',
    validityYears: 3,
  };

  it('should create a card successfully', async () => {
    const response = await request(app).post('/api/cards/create').set('x-user-id', 'divyam').send(newCardData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'card created successfully');
    expect(response.body).toHaveProperty('properties');
    expect(response.body.properties).toHaveProperty('cardId');

    // Save card ID for subsequent tests
    cardId = response.body.properties.cardId;
  });

  it('should fail when creating a card with invalid category', async () => {
    const response = await request(app)
      .post('/api/cards/create')
      .set('x-user-id', 'divyam')
      .send({ ...newCardData, cardCategory: 'INVALID_CATEGORY' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'INVALID CARD CATEGORY');
  });

  it('should retrieve card details successfully', async () => {
    const response = await request(app).get('/api/cards/').set('x-user-id', 'divyam').query({ email: testEmail, cardId });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Data retrieved successfully');
    expect(response.body.properties).toHaveProperty('cardId', cardId);
  });

  it('should update card details successfully', async () => {
    const updates = { cardLimit: 1500 };
    const response = await request(app).post('/api/cards/update').set('x-user-id', 'divyam').send({ email: testEmail, cardId, updates });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'card data updated successfully');
    expect(response.body.properties).toHaveProperty('cardLimit', 1500);
  });

  it('should deactivate the card successfully', async () => {
    const response = await request(app).post('/api/cards/deactivate').set('x-user-id', 'divyam').send({ email: testEmail, cardId });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'card deactivated successfully');
  });

  it.skip('should return an error when trying to deactivate an already deactivated card', async () => {
    const response = await request(app).post('/api/cards/deactivate').set('x-user-id', 'divyam').send({ email: testEmail, cardId });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'no card found for the user. Cannot delete something that does not exist');
  });
});
