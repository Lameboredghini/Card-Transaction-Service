import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();
import app from '../../src/app';

describe('User API Endpoints', () => {
  const email = `divyam+test+${Date.now()}@gmail.com`;
  describe('POST /users/create', () => {
    it('should fail to create a user with an invalid email', async () => {
      const response = await request(app).post('/api/users/create').set('x-user-id', 'divyam').send({ email: 'invalid', name: 'unit test user' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '"email" is invalid. Enter a valid email!');
    });

    it('should create a user successfully', async () => {
      const response = await request(app).post('/api/users/create').set('x-user-id', 'divyam').send({ email, name: 'unit test user' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body).toHaveProperty('accountNumber');
      expect(response.body.properties).toHaveProperty('email', `${email}`);
    });
  });

  describe('GET /users/', () => {
    it('should retrieve the user data successfully', async () => {
      const response = await request(app).get('/api/users/').set('x-user-id', 'divyam').query({ email });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Data retrieved successfully');
      expect(response.body.properties).toHaveProperty('email', `${email}`);
    });
  });

  describe('POST /users/update', () => {
    it('should update user data successfully', async () => {
      const response = await request(app)
        .post('/api/users/update')
        .set('x-user-id', 'divyam')
        .send({ email, updates: { name: 'updated test user' } });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User updated successfully');
      expect(response.body.properties).toHaveProperty('name', 'updated test user');
    });
  });

  describe('POST /users/delete', () => {
    it('should delete the user successfully', async () => {
      const response = await request(app).post('/api/users/delete').set('x-user-id', 'divyam').send({ email });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User deleted successfully');
    });
  });
});
