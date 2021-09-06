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

const mockCategories = [
  {
    id: 1,
    name: `Деревья`,
  },
  {
    id: 2,
    name: `За жизнь`
  },
  {
    id: 3,
    name: `Без рамки`
  },
  {
    id: 4,
    name: `Разное`
  }
];

const mockArticles = [
  {
    "title": `Как собрать камни бесконечности new`,
    "publishedAt": `2021-03-20 09:32:01`,
    "announce": `Программировать не настолько сложно, как об этом говорят. Программировать не настолько сложно, как об этом говорят new. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Достичь успеха помогут ежедневные повторения new. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами new. Собрать камни бесконечности легко, если вы прирожденный герой. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много new. Золотое сечение — соотношение двух величин, гармоническая пропорция new. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами new. Простые ежедневные упражнения помогут достичь успеха new. Это один из лучших рок-музыкантов new. Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят new. Ёлки — это не просто красивое дерево. Это прочная древесина. Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры new. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете new. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Он написал больше 30 хитов new. Собрать камни бесконечности легко, если вы прирожденный герой new. Ёлки — это не просто красивое дерево. Это прочная древесина new. Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Первая большая ёлка была установлена только в 1938 году. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем new. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать new.`,
    "categories": [1, 2, 3],
    "comments": [
      {
        "text": `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы! Согласен с автором! Планируете записать видосик на эту тему Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    "title": `Title`,
    "publishedAt": `2020-02-10 09:32:01`,
    "announce": `test announce`,
    "fullText": `test full text`,
    "categories": [2, 3],
    "comments": [
      {
        "text": `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы! Согласен с автором! Планируете записать видосик на эту тему Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  }
];

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

