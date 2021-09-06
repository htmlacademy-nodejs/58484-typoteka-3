'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
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
    "id": 1,
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
    "id": 2,
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

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  const roles = USER_ROLES.map((title) => ({title}));
  const users = Array.from({length: 5}).map(() => createUser({
    roleId: getRandomInt(1, roles.length),
  }));
  const categoriesName = mockCategories.map(({name}) => name);

  await initDB(mockDB, {categories: categoriesName, articles: mockArticles, roles, users});
  const app = express();
  app.use(express.json());
  article(app, new DataService(mockDB), new CommentService(mockDB));

  return app;
};

describe(`service/api/article.js`, () => {

  describe(`API returns a list of all articles`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .get(`/articles`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns a list of 2 articles`, () => {
      expect(response.body.length).toBe(2);
    });

    it(`First article's id equals 1`, () => {
      expect(response.body[0].id).toBe(1);
    });

  });

  describe(`API returns an article with given id`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/articles/1`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Article's title is "Как собрать камни бесконечности new"`, () => {
      expect(response.body.title).toBe(`Как собрать камни бесконечности new`);
    });

    it(`Status code 404`, async () => {
      response = await request(app)
        .get(`/articles/999`);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    it(`Status code 400 if pass invalid article id`, async () => {
      response = await request(app)
        .get(`/articles/invalidID`);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

  });

  describe(`API creates an article if data is valid`, () => {
    const newArticle = {
      categories: [1, 2],
      title: `Дам погладить котика`,
      fullText: `Дам погладить котика. Дорого. Не гербалайф`,
      announce: `Дам погладить котика`,
      publishedAt: new Date(`2020-11-11 17:02:47`).toISOString()
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/articles`)
        .send(newArticle);
    });

    it(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`Returns article created`, () => {
      delete newArticle.categories;
      expect(response.body).toEqual(expect.objectContaining(newArticle));
    });

    it(`Offers count is changed`, async () => {
      response = await request(app)
        .get(`/articles`);

      expect(response.body.length).toBe(3);
    });

  });

  describe(`API refuses to create an article if data is invalid`, () => {
    const newArticle = {
      categories: [1, 2],
      title: `Дам погладить котика`,
      fullText: `Дам погладить котика. Дорого. Не гербалайф`,
      announce: `Дам погладить котика`,
      publishedAt: new Date(`2020-11-11 17:02:47`).toISOString()
    };

    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    it(`Without any required property response code is 400`, async () => {
      // eslint-disable-next-line max-nested-callbacks
      const promises = Object.keys(newArticle).map(async (key) => {
        const badOffer = {...newArticle};
        delete badOffer[key];

        const response = await request(app)
          .post(`/articles`)
          .send(badOffer);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      });

      await Promise.all(promises);
    });

  });

  describe(`API changes existent article`, () => {
    const newArticle = {
      categories: [1, 2],
      title: `Дам погладить котика`,
      fullText: `Дам погладить котика. Дорого. Не гербалайф`,
      announce: `Дам погладить котика`,
      publishedAt: new Date(`2020-11-11 17:02:47`).toISOString()
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .put(`/articles/1`)
        .send(newArticle);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns changed article`, () => {
      expect(response.body).toBeTruthy();
    });

    it(`Offer have changed title equals "Дам погладить котика"`, async () => {
      response = await request(app)
        .get(`/articles/1`);

      expect(response.body.title).toBe(`Дам погладить котика`);
    });

  });

  it(`API returns status code 404 when trying to change non-existent article`, async () => {
    const app = await createAPI();

    const validArticle = {
      categories: [1, 2],
      title: `Дам погладить котика`,
      fullText: `Дам погладить котика. Дорого. Не гербалайф`,
      announce: `Дам погладить котика`,
      publishedAt: new Date(`2020-11-11 17:02:47`).toISOString()
    };

    const response = await request(app)
      .put(`/articles/999`)
      .send(validArticle);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  it(`API returns status code 400 when trying to change an article with invalid data`, async () => {
    const app = await createAPI();

    const invalidArticle = {
      title: `Дам погладить котика`,
      fullText: `Дам погладить котика. Дорого. Не гербалайф`,
      announce: `Дам погладить котика`,
      publishedAt: new Date(`2020-11-11 17:02:47`).toISOString()
    };

    const response = await request(app)
      .put(`/articles/1`)
      .send(invalidArticle);

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  describe(`API correctly deletes an article`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/articles/1`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns deleted article`, () => {
      expect(response.body).toBeTruthy();
    });

    it(`Offer count is 1 now`, async () => {
      response = await request(app)
        .get(`/articles`);

      expect(response.body.length).toBe(1);
    });

  });

  it(`API refuses to delete non-existent article`, async () => {

    const app = await createAPI();

    const response = await request(app)
      .delete(`/articles/999`);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  describe(`API returns a list of comments to given article`, () => {

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .get(`/articles/1/comments`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns list of 2 comments`, () => {
      expect(response.body.length).toBe(2);
    });

    it(`Second comment's text is "Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете."`, () => {
      expect(response.body[1].text).toBe(`Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`);
    });

  });

  describe(`API creates a comment if data is valid`, () => {

    const newComment = {
      text: `Валидному комментарию достаточно этого поля`
    };

    global.user = {
      id: 1
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .post(`/articles/2/comments`)
        .send(newComment);
    });

    it(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`Comments count is changed`, async () => {
      response = await request(app)
        .get(`/articles/2/comments`);

      expect(response.body.length).toBe(2);
    });

  });

  it(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {

    const app = await createAPI();

    const response = await request(app)
      .post(`/articles/999/comments`)
      .send({
        text: `Неважно`
      });

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);

  });

  it(`API refuses to delete non-existent comment`, async () => {

    const app = await createAPI();

    const response = await request(app)
      .delete(`/articles/1/comments/999`);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);

  });
});
