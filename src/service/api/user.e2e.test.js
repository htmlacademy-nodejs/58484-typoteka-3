'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const user = require(`./user`);
const UserService = require(`../data-service/user`);
const password = require(`../lib/password`);
const {createUser} = require(`../cli/factories/user-factory`);
const {getRandomInt} = require(`../../utils`);
const {HttpCode, USER_ROLES} = require(`../../constants`);
const {mockCategories, mockArticles} = require(`./mocks`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  const roles = USER_ROLES.map((title) => ({title}));
  const users = Array.from({length: 5}).map(() => createUser({
    roleId: getRandomInt(1, roles.length),
  }));
  users.push(createUser({
    email: `ivanov@example.com`,
    firstName: `Иван`,
    lastName: `Иванов`,
    password: password.hashSync(`ivanov`),
    roleId: getRandomInt(1, roles.length),
  }));
  const categoriesName = mockCategories.map(({name}) => name);

  await initDB(mockDB, {categories: categoriesName, articles: mockArticles, roles, users});
  const app = express();
  app.use(express.json());
  user(app, new UserService(mockDB));

  return app;
};

describe(`service/api/user.js`, () => {

  describe(`API returns a list of all users`, () => {
    const validUserData = {
      firstName: `Сидор`,
      lastName: `Сидоров`,
      email: `sidorov@example.com`,
      password: `sidorov`,
      passwordRepeated: `sidorov`,
      avatar: `sidorov.jpg`
    };

    let response;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .post(`/user`)
        .send(validUserData);
    });

    it(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });
  });

  describe(`API refuses to create user if data is invalid`, () => {
    const validUserData = {
      firstName: `Сидор`,
      lastName: `Сидоров`,
      email: `sidorov@example.com`,
      password: `sidorov`,
      passwordRepeated: `sidorov`
    };

    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    it(`Without any required property response code is 400`, async () => {
      // eslint-disable-next-line max-nested-callbacks
      const promises = Object.keys(validUserData).map(async (key) => {
        const badUserData = {...validUserData};
        delete badUserData[key];

        const response = await request(app)
          .post(`/user`)
          .send(badUserData);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      });

      await Promise.all(promises);
    });

    it(`When field type is wrong response code is 400`, async () => {
      const badUsers = [
        {...validUserData, firstName: true},
        {...validUserData, email: 1}
      ];

      // eslint-disable-next-line max-nested-callbacks
      const promises = badUsers.map(async (badUserData) => {
        const response = await request(app)
          .post(`/user`)
          .send(badUserData);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      });

      await Promise.all(promises);
    });

    it(`When field value is wrong response code is 400`, async () => {
      const badUsers = [
        {...validUserData, password: `short`, passwordRepeated: `short`},
        {...validUserData, email: `invalid`}
      ];

      // eslint-disable-next-line max-nested-callbacks
      const promises = badUsers.map(async (badUserData) => {
        const response = await request(app)
          .post(`/user`)
          .send(badUserData);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      });

      await Promise.all(promises);
    });

    it(`When password and passwordRepeated are not equal, code is 400`, async () => {
      const badUserData = {...validUserData, passwordRepeated: `not sidorov`};
      const response = await request(app)
        .post(`/user`)
        .send(badUserData);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    it(`When email is already in use status code is 400`, async () => {
      const badUserData = {...validUserData, email: `ivanov@example.com`};

      const response = await request(app)
        .post(`/user`)
        .send(badUserData);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API authenticate user if data is valid`, () => {
    const validAuthData = {
      email: `ivanov@example.com`,
      password: `ivanov`
    };

    let response;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .post(`/user/auth`)
        .send(validAuthData);
    });

    it(`Status code is 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`User name is Иван Иванов`, () => {
      expect(response.body.firstName).toBe(`Иван`);
      expect(response.body.lastName).toBe(`Иванов`);
    });
  });

  describe(`API refuses to authenticate user if data is invalid`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    it(`If email is incorrect status is 401`, async () => {
      const badAuthData = {
        email: `not-exist@example.com`,
        password: `petrov`
      };
      const response = await request(app)
        .post(`/user/auth`)
        .send(badAuthData);

      expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    });

    it(`If password doesn't match status is 401`, async () => {
      const badAuthData = {
        email: `ivanov@example.com`,
        password: `bad-password`
      };
      const response = await request(app)
      .post(`/user/auth`)
      .send(badAuthData);

      expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    });
  });
});
