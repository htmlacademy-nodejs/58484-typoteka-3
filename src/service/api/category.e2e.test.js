'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {createUser} = require(`../cli/factories/user-factory`);
const {getRandomInt} = require(`../../utils`);
const {HttpCode, USER_ROLES} = require(`../../constants`);
const {mockCategories, mockArticles} = require(`./mocks`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});


const createApi = async () => {
  const roles = USER_ROLES.map((title) => ({title}));
  const users = Array.from({length: 5}).map(() => createUser({
    roleId: getRandomInt(1, roles.length),
  }));
  const categoriesName = mockCategories.map(({name}) => name);

  await initDB(mockDB, {categories: categoriesName, articles: mockArticles, roles, users});
  const app = express();
  app.use(express.json());
  category(app, new DataService(mockDB));

  return app;
};

describe(`service/api/category.js`, () => {

  describe(`API returns category list`, () => {

    let response;

    beforeAll(async () => {
      const app = await createApi();
      response = await request(app)
        .get(`/categories`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns list of 4 categories`, () => {
      expect(response.body.length).toBe(4);
    });

    it(`Category names are "Деревья", "За жизнь", "Без рамки", "Разное"`, () => {
      expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining(
                {title: `Деревья`},
                {title: `За жизнь`},
                {title: `Без рамки`},
                {title: `Разное`}
            )
          ])
      );
    });

  });

  describe(`API creates an category if data is valid`, () => {
    const newCategory = {
      category: `New category`
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createApi();
      response = await request(app)
        .post(`/categories`)
        .send(newCategory);
    });

    it(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`Returns category created`, () => {
      expect(response.body.title).toEqual(newCategory.category);
    });

    it(`Categories count is changed`, async () => {
      response = await request(app)
        .get(`/categories`);

      expect(response.body.length).toBe(5);
    });

  });

  describe(`API refuses to create an category if data is invalid`, () => {
    const newCategory = {};

    let response;

    beforeAll(async () => {
      const app = await createApi();
      response = await request(app)
        .post(`/categories`)
        .send(newCategory);
    });

    it(`Without any required property response code is 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

  });

  describe(`API changes existent category`, () => {
    const newCategory = {
      category: `updated category`
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createApi();
      response = await request(app)
        .put(`/categories/edit/1`)
        .send(newCategory);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns changed category`, () => {
      expect(response.body).toBeTruthy();
    });

    it(`Category have changed title equals "updated category"`, async () => {
      response = await request(app)
        .get(`/categories`);

      expect(response.body[0].title).toBe(`updated category`);
    });

  });

  describe(`API refuses to update an category if data is invalid`, () => {
    const newCategory = {};

    let response;

    beforeAll(async () => {
      const app = await createApi();
      response = await request(app)
        .put(`/categories/edit/1`)
        .send(newCategory);
    });

    it(`Without any required property response code is 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

  });

  describe(`API correctly deletes an categories`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createApi();
      response = await request(app)
        .delete(`/categories/4`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns deleted article`, () => {
      expect(response.body).toBeTruthy();
    });

    it(`Category count is 3 now`, async () => {
      response = await request(app)
        .get(`/categories`);

      expect(response.body.length).toBe(3);
    });

  });

  describe(`API refuses to deleted an category if category has articles`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createApi();
      response = await request(app)
        .delete(`/categories/1`);
    });

    it(`Status code 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    it(`Category count is 4 now`, async () => {
      response = await request(app)
        .get(`/categories`);

      expect(response.body.length).toBe(4);
    });

  });
});

