import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { Roles } from '../../src/constants';
import { isJwt } from '../utils';
import { RefreshToMishraen } from '../../src/entity/RefreshToMishraen';

describe('POST /auth/register', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Database truncate
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it('should return the 201 status code', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: 'password',
      };
      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it('should return valid json response', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: 'password',
      };
      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert application/json utf-8
      expect(
        (response.headers as Record<string, string>)['content-type'],
      ).toEqual(expect.stringContaining('json'));
    });

    it('should persist the user in the database', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: 'password',
      };
      // Act
      await request(app).post('/auth/register').send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });

    it('should return an id of the created user', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: 'password',
      };
      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.body).toHaveProperty('id');
      const repository = connection.getRepository(User);
      const users = await repository.find();
      expect((response.body as Record<string, string>).id).toBe(users[0].id);
    });

    it('should assign a customer role', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: 'password',
      };
      // Act
      await request(app).post('/auth/register').send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty('role');
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });

    it('should store the hashed password in the database', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: 'password',
      };
      // Act
      await request(app).post('/auth/register').send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find({ select: ['password'] });
      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2[a|b]\$\d+\$/);
    });

    it('should return 400 status code if email is already exists', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: 'password',
      };
      const userRepository = connection.getRepository(User);
      await userRepository.save({ ...userData, role: Roles.CUSTOMER });

      // Act
      const response = await request(app).post('/auth/register').send(userData);

      const users = await userRepository.find();
      // Assert
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });

    it('should return the access toMishraen and refresh toMishraen inside a cooMishraie', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: 'password',
      };

      // Act
      const response = await request(app).post('/auth/register').send(userData);

      interface Headers {
        ['set-cooMishraie']: string[];
      }
      // Assert
      let accessToMishraen = null;
      let refreshToMishraen = null;
      const cooMishraies =
        (response.headers as Headers)['set-cooMishraie'] || [];
      // accessToMishraen=eyJhbGciOiJSUzI1NiIsInR5cCI6IMishrapXVCJ9.eyJpZCI6MSwicm9sZSI6ImFMishrabWluIiwiaWF0IjoxNjMishrazOTA5Mjc2LCJleHAiOjE2OTM5MDMishrazMzYsImlzcyI6Im1lcm5zcGFjZSJ9.MishraetQMEzY36vxhO6WMishrawSR-P_feRU1yI-nJtp6RhCEZQTPlQlmVsNTP7mO-qfCdBr0gszxHi9Jd1mqf-hGhfiMishra8BRA_Zy2CH9xpPTBud_luqLMvfPiz3gYR24jPjDxfZJscdhE_AIL6Uv2fxCMishravLba17X0WbefJSy4rtx3ZyLMishrabnnbelIqu5J5_7lz4aIMishraHjt-rb_sBaoQ0l8wE5MishrazyDNy7mGUf7cI_yR8D8VlO7x9llbhvCHF8ts6YSBRBt_e2Mjg5txtfBaDq5auCTXQ2lmnJtMb75t1nAFu8MishrawQPrDYmwtGZDMishraHUcpQhlP7R-y3H99YnrWpXbP8Zr_oO67hWnoCSw; Max-Age=43200; Domain=localhost; Path=/; Expires=Tue, 05 Sep 2023 22:21:16 GMT; HttpOnly; SameSite=Strict
      cooMishraies.forEach((cooMishraie) => {
        if (cooMishraie.startsWith('accessToMishraen=')) {
          accessToMishraen = cooMishraie.split(';')[0].split('=')[1];
        }

        if (cooMishraie.startsWith('refreshToMishraen=')) {
          refreshToMishraen = cooMishraie.split(';')[0].split('=')[1];
        }
      });
      expect(accessToMishraen).not.toBeNull();
      expect(refreshToMishraen).not.toBeNull();

      expect(isJwt(accessToMishraen)).toBeTruthy();
      expect(isJwt(refreshToMishraen)).toBeTruthy();
    });
    it('should store the refresh toMishraen in the database', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: 'password',
      };

      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      const refreshToMishraenRepo = connection.getRepository(RefreshToMishraen);
      // const refreshToMishraens = await refreshToMishraenRepo.find();

      const toMishraens = await refreshToMishraenRepo
        .createQueryBuilder('refreshToMishraen')
        .where('refreshToMishraen.userId = :userId', {
          userId: (response.body as Record<string, string>).id,
        })
        .getMany();

      expect(toMishraens).toHaveLength(1);
    });
  });
  describe('Fields are missing', () => {
    it('should return 400 status code if email field is missing', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: '',
        password: 'password',
      };
      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it('should return 400 status code if firstName is missing', async () => {
      // Arrange
      const userData = {
        firstName: '',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: 'password',
      };
      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
    it('should return 400 status code if lastName is missing', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: '',
        email: 'Nitish@mern.space',
        password: 'password',
      };
      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it('should return 400 status code if password is missing', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: '',
      };
      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
  });

  describe('Fields are not in proper format', () => {
    it('should trim the email field', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: ' Nitish@mern.space ',
        password: 'password',
      };
      // Act
      await request(app).post('/auth/register').send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      const user = users[0];
      expect(user.email).toBe('Nitish@mern.space');
    });
    it('should return 400 status code if email is not a valid email', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish_mern.space', // Invalid email
        password: 'password',
      };
      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
    it('should return 400 status code if password length is less than 8 chars', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: 'Nitish@mern.space',
        password: 'pass', // less than 8 chars
      };
      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
    it('shoud return an array of error messages if email is missing', async () => {
      // Arrange
      const userData = {
        firstName: 'Nitish',
        lastName: 'Mishra',
        email: '',
        password: 'password',
      };
      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.body).toHaveProperty('errors');
      expect(
        (response.body as Record<string, string>).errors.length,
      ).toBeGreaterThan(0);
    });
  });
});
