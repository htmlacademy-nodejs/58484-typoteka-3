'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    'id': `TvTkze`,
    'title': `Самый лучший музыкальный альбом этого года new`,
    'createdDate': `2020-11-11 17:02:47`,
    'announce': `Первая большая ёлка была установлена только в 1938 году new. Это один из лучших рок-музыкантов new. Он написал больше 30 хитов new. Как начать действовать? Для начала просто соберитесь new.`,
    'fullText': `Это один из лучших рок-музыкантов new. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина new. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем new. Он написал больше 30 хитов.`,
    'category': [
      `IT new`,
      `Кино new`,
      `Программирование new`,
      `Без рамки new`,
      `Деревья new`,
      `Железо new`,
      `Музыка new`,
      `Разное`,
      `За жизнь`
    ],
    'comments': [
      {
        'id': `WbwLNw`,
        'text': `Мне кажется или я уже читал это где-то? Согласен с автором!`
      },
      {
        'id': `AzqjgJ`,
        'text': `Согласен с автором! Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Планируете записать видосик на эту тему Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    'id': `jfrtpG`,
    'title': `Обзор новейшего смартфона`,
    'createdDate': `2020-11-24 11:06:50`,
    'announce': `Он написал больше 30 хитов new. Собрать камни бесконечности легко, если вы прирожденный герой new. Вы можете достичь всего. Стоит только немного постараться и запастись книгами new. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    'fullText': `Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь new. Программировать не настолько сложно, как об этом говорят new. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать new. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много new. Ёлки — это не просто красивое дерево. Это прочная древесина new. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Как начать действовать? Для начала просто соберитесь.`,
    'category': [
      `IT new`,
      `Музыка`,
      `Без рамки new`,
      `Музыка new`,
      `Программирование new`,
      `Деревья new`,
      `Железо new`
    ],
    'comments': [
      {
        'id': `THmVC2`,
        'text': `Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Согласен с автором! Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы!"`
      },
      {
        'id': `QXTcGG`,
        'text': `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Совсем немного... Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Планируете записать видосик на эту тему"`
      }
    ]
  },
  {
    'id': `MKqmf-`,
    'title': `Лучшие рок-музыканты 20-века`,
    'createdDate': `2020-11-17 20:47:06`,
    'announce': `Вы можете достичь всего. Стоит только немного постараться и запастись книгами new. Это один из лучших рок-музыкантов new. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов new.`,
    'fullText': `Ёлки — это не просто красивое дерево. Это прочная древесина new. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много new. Первая большая ёлка была установлена только в 1938 году. Золотое сечение — соотношение двух величин, гармоническая пропорция new. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году new. Это один из лучших рок-музыкантов new. Программировать не настолько сложно, как об этом говорят new. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем new. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения new. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры new. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете new. Собрать камни бесконечности легко, если вы прирожденный герой new. Он написал больше 30 хитов new. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике new. Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов new. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать new. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами new. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    'category': [
      `Музыка new`,
      `Без рамки`,
      `IT new`,
      `За жизнь new`,
      `Без рамки new`,
      `Деревья new`,
      `Железо new`
    ],
    'comments': [
      {
        'id': `xaekHR`,
        'text': `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили."`
      },
      {
        'id': `kXpBbP`,
        'text': `Плюсую, но слишком много буквы!"`
      },
      {
        'id': `arHyfJ`,
        'text': `Планируете записать видосик на эту тему Мне кажется или я уже читал это где-то?"`
      },
      {
        'id': `ygCOhc`,
        'text': `Плюсую, но слишком много буквы! Планируете записать видосик на эту тему Совсем немного... Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете."`
      }
    ]
  },
  {
    'id': `eX7GHG`,
    'title': `Как перестать беспокоиться и начать жить new`,
    'createdDate': `2020-11-13 14:31:45`,
    'announce': `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем new. Простые ежедневные упражнения помогут достичь успеха new. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры new. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    'fullText': `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Ёлки — это не просто красивое дерево. Это прочная древесина. Ёлки — это не просто красивое дерево. Это прочная древесина new. Программировать не настолько сложно, как об этом говорят new. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле new? Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха new. Достичь успеха помогут ежедневные повторения new. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете new. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике new. Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами new. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры new. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами new. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов. Он написал больше 30 хитов new. Золотое сечение — соотношение двух величин, гармоническая пропорция new. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много new. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь new. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем new. Первая большая ёлка была установлена только в 1938 году.`,
    'category': [
      `Музыка`
    ],
    'comments': [
      {
        'id': `SX-aiT`,
        'text': `Это где ж такие красоты? Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему"`
      },
      {
        'id': `SLVhh5`,
        'text': `Планируете записать видосик на эту тему Мне не нравится ваш стиль. Ощущение, что вы меня поучаете."`
      },
      {
        'id': `0i20C2`,
        'text': `Это где ж такие красоты? Совсем немного... Согласен с автором! Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили."`
      }
    ]
  },
  {
    'id': `UFnGFQ`,
    'title': `Что такое золотое сечение`,
    'createdDate': `2020-11-25 07:26:57`,
    'announce': `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами new. Это один из лучших рок-музыкантов new. Вы можете достичь всего. Стоит только немного постараться и запастись книгами new. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    'fullText': `Золотое сечение — соотношение двух величин, гармоническая пропорция new. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры new. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике new. Собрать камни бесконечности легко, если вы прирожденный герой new. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Программировать не настолько сложно, как об этом говорят new. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле new?`,
    'category': [
      `Без рамки`,
      `Кино`,
      `Без рамки new`,
      `Музыка new`,
      `Кино new`,
      `Разное new`,
      `За жизнь`,
      `Музыка`
    ],
    'comments': [
      {
        'id': `o_vhWW`,
        'text': `Планируете записать видосик на эту тему Хочу такую же футболку :-) Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором!"`
      },
      {
        'id': `DoF0EF`,
        'text': `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему Совсем немного... Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Согласен с автором!"`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());

  article(app, new DataService(cloneData), new CommentService());
  return app;
};

const newArticle = {
  category: `Котики`,
  title: `Дам погладить котика`,
  fullText: `Дам погладить котика. Дорого. Не гербалайф`,
  announce: `Дам погладить котика`,
  createdDate: '2020-11-11 17:02:47'
};

describe(`service/api/article.js`, () => {

  describe(`API returns a list of all articles`, () => {
    const app = createAPI();

    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/articles`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns a list of 5 articles`, () => {
      expect(response.body.length).toBe(5);
    });

    it(`First article's id equals "TvTkze"`, () => {
      expect(response.body[0].id).toBe(`TvTkze`);
    });

  });

  describe(`API returns an article with given id`, () => {

    const app = createAPI();

    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/articles/TvTkze`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Article's title is "Самый лучший музыкальный альбом этого года new"`, () => {
      expect(response.body.title).toBe(`Самый лучший музыкальный альбом этого года new`);
    });

    it(`Status code 404`, async () => {
      response = await request(app)
        .get(`/articles/TvTkzeTEST`);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`API creates an article if data is valid`, () => {

    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/articles`)
        .send(newArticle);
    });

    it(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`Returns article created`, () => {
      expect(response.body).toEqual(expect.objectContaining(newArticle));
    });

    it(`Offers count is changed`, async () => {
      response = await request(app)
        .get(`/articles`);

      expect(response.body.length).toBe(6);
    });

  });

  describe(`API refuses to create an article if data is invalid`, () => {

    const app = createAPI();

    it(`Without any required property response code is 400`, async () => {
      for (const key of Object.keys(newArticle)) {
        const badOffer = {...newArticle};
        delete badOffer[key];

        const response = await request(app)
          .post(`/articles`)
          .send(badOffer);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }

    });

  });

  describe(`API changes existent article`, () => {

    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .put(`/articles/TvTkze`)
        .send(newArticle);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns changed article`, () => {
      expect(response.body).toEqual(expect.objectContaining(newArticle));
    });

    it(`Offer have changed title equals "Дам погладить котика"`, async () => {
      response = await request(app)
        .get(`/articles/TvTkze`);

      expect(response.body.title).toBe(`Дам погладить котика`);
    });

  });

  it(`API returns status code 404 when trying to change non-existent article`, async () => {
    const app = createAPI();

    const validArticle = {
      category: `Это`,
      title: `валидный`,
      description: `объект`,
      picture: `объявления`,
      type: `однако`,
      sum: 404
    };

    const response = await request(app)
      .put(`/articles/NOEXST`)
      .send(validArticle);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  it(`API returns status code 400 when trying to change an article with invalid data`, async () => {
    const app = createAPI();

    const invalidArticle = {
      category: `Это`,
      title: `невалидный`,
      description: `объект`,
      picture: `объявления`,
      type: `нет поля sum`
    };

    const response = await request(app)
      .put(`/articles/TvTkze`)
      .send(invalidArticle);

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  describe(`API correctly deletes an article`, () => {

    const app = createAPI();

    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/articles/TvTkze`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns deleted article`, () => {
      expect(response.body.id).toBe(`TvTkze`);
    });

    it(`Offer count is 4 now`, async () => {
      response = await request(app)
        .get(`/articles`);

      expect(response.body.length).toBe(4);
    });

  });

  it(`API refuses to delete non-existent article`, async () => {

    const app = createAPI();

    const response = await request(app)
      .delete(`/articles/NOEXST`);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  describe(`API returns a list of comments to given article`, () => {

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .get(`/articles/TvTkze/comments`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns list of 2 comments`, () => {
      expect(response.body.length).toBe(2);
    });

    it(`First comment's text is "Мне кажется или я уже читал это где-то? Согласен с автором!"`, () => {
      expect(response.body[0].text).toBe(`Мне кажется или я уже читал это где-то? Согласен с автором!`);
    });

  });

  describe(`API creates a comment if data is valid`, () => {

    const newComment = {
      text: `Валидному комментарию достаточно этого поля`
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .post(`/articles/TvTkze/comments`)
        .send(newComment);
    });

    it(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`Comments count is changed`, async () => {
      response = await request(app)
        .get(`/articles/TvTkze/comments`);

      expect(response.body.length).toBe(3);
    });

  });

  it(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {

    const app = createAPI();

    const response = await request(app)
      .post(`/articles/NOEXST/comments`)
      .send({
        text: `Неважно`
      });

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);

  });

  it(`API refuses to delete non-existent comment`, async () => {

    const app = createAPI();

    const response = await request(app)
      .delete(`/articles/TvTkze/comments/NOEXST`);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);

  });
});
