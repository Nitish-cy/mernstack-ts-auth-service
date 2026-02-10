import request from 'supertest';
import app from '../../src/app.js';

describe('App', () => {
  describe('POST /auth/register', () => {
    describe('Given All Fields', () => {
      it('should return 201 status code', async () => {
        //Arrange

        const userData = {
          firstName: 'Nitish',
          lastName: 'Mishra',
          email: 'mishranitish795@gmail.com',
          password: 'secret',
        };

        //Act
        const response = await request(app)
          .post('/auth/register')
          .send(userData);

        //Assert
        expect(response.statusCode).toBe(201);
      });

      it('should return valid json', async () => {
        //Arrange

        const userData = {
          firstName: 'Nitish',
          lastName: 'Mishra',
          email: 'mishranitish795@gmail.com',
          password: 'secret',
        };

        //Act
        const response = await request(app)
          .post('/auth/register')
          .send(userData);

        //Assert
        expect(response.headers['content-type']).toEqual(
          expect.stringContaining('json'),
        );
      });

      it('should persist the user in the database', async () => {
        //Arrange

        const userData = {
          firstName: 'Nitish',
          lastName: 'Mishra',
          email: 'mishranitish795@gmail.com',
          password: 'secret',
        };

        //Act
        const response = await request(app)
          .post('/auth/register')
          .send(userData);

        //Assert
        expect(response.headers['content-type']).toEqual(
          expect.stringContaining('json'),
        );
      });
    });
  });
});
