'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const comment = require(`./comment`);
const DataService = require(`../data-service/comment`);
const {createUser} = require(`../cli/factories/user-factory`);
const {getRandomInt} = require(`../../utils`);
const {HttpCode, USER_ROLES} = require(`../../constants`);
const {mockCategories, mockArticles} = require(`./mocks`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

describe(`service/api/category.js`, () => {
  beforeAll(async () => {
    const roles = USER_ROLES.map((title) => ({title}));
    const users = Array.from({length: 5}).map(() => createUser({
      roleId: getRandomInt(1, roles.length),
    }));
    const categoriesName = mockCategories.map(({name}) => name);

    await initDB(mockDB, {categories: categoriesName, articles: mockArticles, roles, users});
    comment(app, new DataService(mockDB));
  });

  describe(`API returns last comments.`, () => {
    const LIMIT = 2;

    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/comments/last?limit=${LIMIT}`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns list of LIMIT comments`, () => {
      expect(response.body.length).toBe(LIMIT);
    });

  });

  describe(`API returns a list of all comments`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/comments`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns list of 3 comments`, () => {
      expect(response.body.length).toBe(3);
    });
  });

  describe(`API correctly deletes an comments`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/comments/1`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns deleted article`, () => {
      expect(response.body).toBeTruthy();
    });

    it(`Category count is 2 now`, async () => {
      response = await request(app)
        .get(`/comments`);

      expect(response.body.length).toBe(2);
    });

  });
});

