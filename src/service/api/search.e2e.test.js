'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {createUser} = require(`../cli/factories/user-factory`);
const {getRandomInt} = require(`../../utils`);
const {HttpCode, USER_ROLES} = require(`../../constants`);
const {mockCategories, mockArticles} = require(`./mocks`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  const roles = USER_ROLES.map((title) => ({title}));
  const users = Array.from({length: 5}).map(() => createUser({
    roleId: getRandomInt(1, roles.length),
  }));
  const categoriesName = mockCategories.map(({name}) => name);

  await initDB(mockDB, {categories: categoriesName, articles: mockArticles, roles, users});
  search(app, new DataService(mockDB));
});


describe(`service/api/search.js`, () => {

  describe(`API returns offer based on search query`, () => {

    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/search`)
        .query({
          query: `Как собрать камни`
        });
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`1 offer found`, () => {
      expect(response.body.length).toBe(1);
    });

    it(`Offer has correct title`, () => {
      expect(response.body[0].title).toBe(`Как собрать камни бесконечности new`);
    });

  });

  it(`API returns code 404 if nothing is found`, async () => {
    const response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      });

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  it(`API returns code 400 if query is not pass`, async () => {
    const response = await request(app)
      .get(`/search`);

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});
