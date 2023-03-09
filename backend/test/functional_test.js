const request = require('supertest');
const app = require('../server');
const User = require('../models/users');
const { describe, test, expect } = require('@jest/globals');

describe('UsersRouter', () => {
  describe('GET /api/users/:username', () => {
    it('should return true if user exists', async () => {
      const testUser = new User({
        username: 'test_user',
        password: 'password123',
        email: 'test_user@example.com'
      });
      await testUser.save();
      const res = await request(app).get('/api/users/test_user');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(true);
      await testUser.remove();
    });

    it('should return false if user does not exist', async () => {
      const res = await request(app).get('/api/users/nonexistent_user');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual(false);
    });
  });

  describe('POST /api/users/login', () => {
    it('should return a token for valid credentials', async () => {
      const testUser = new User({
        username: 'test_user',
        password: '$2a$10$hx3Jq3v2z9Cm1atK/Yfg0uWq3vQyUmq/i1U6zyIJU6z8ItYUCXEq6',
        email: 'test_user@example.com'
      });
      await testUser.save();
      const res = await request(app)
        .post('/api/users/login')
        .send({
          username: 'test_user',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      await testUser.remove();
    });

    it('should return an error message for invalid credentials', async () => {
      const testUser = new User({
        username: 'test_user',
        password: '$2a$10$hx3Jq3v2z9Cm1atK/Yfg0uWq3vQyUmq/i1U6zyIJU6z8ItYUCXEq6',
        email: 'test_user@example.com'
      });
      await testUser.save();
      const res = await request(app)
        .post('/api/users/login')
        .send({
          username: 'test_user',
          password: 'wrong_password'
        });
      expect(res.statusCode).toEqual(401);
      expect(res.text).toEqual('Contraseña incorrecta');
      await testUser.remove();
    });

    it('should return an error message for a non-existent user', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          username: 'nonexistent_user',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('Usuario no encontrado');
    });
  });
  describe('PUT /api/users/:userId/change-password', () => {
    let authToken;
    let userId;
  
    before(async () => {
      // Login to get auth token
      const res = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'testpassword'
        });
      authToken = res.body.token;
  
      // Get user ID
      const user = await User.findOne({ username: 'testuser' });
      userId = user._id;
    });
  
    it('should return an error if user is not authenticated', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}/change-password`)
        .send({
          currentPassword: 'testpassword',
          newPassword: 'newpassword'
        });
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });
  
    it('should return an error if current password is incorrect', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}/change-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword'
        });
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Current password is incorrect');
    });
  
    it('should update password if current password is correct', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}/change-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'testpassword',
          newPassword: 'newpassword'
        });
      expect(res.status).to.equal(200);
      expect(res.text).to.equal('Password updated successfully');
  
      // Check if password is updated in the database
      const user = await User.findById(userId);
      const isMatch = await bcrypt.compare('newpassword', user.password);
      expect(isMatch).to.be.true;
    });
  });
});  
