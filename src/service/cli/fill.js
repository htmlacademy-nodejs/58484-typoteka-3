'use strict';

const fs = require(`fs`).promises;
const {createUser} = require(`./factories/user-factory`);
const {generateDate} = require(`./factories/date-factory`);

const {
  ExitCode,
  MOCKS_DB_FILE_NAME,
  MockFileName,
} = require(`../../constants`);
const {ChalkTheme} = require(`./chalk-theme`);

const {
  success,
  error,
  warning,
} = ChalkTheme.generate;

const {
  getRandomInt,
  shuffle,
  getRandomItems,
  getRandomItem,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT_LIMIT = 1000;
const MAX_CATEGORY_LIMIT = 4;
const USER_COUNT = 5;
const USER_ROLES = [
  `Гость`,
  `Читатель`,
  `Автор`,
];

const getFileContent = async (fileName) => {
  try {
    const data = await fs.readFile(fileName, `utf8`);

    return data
      .trim()
      .split(`\n`);
  } catch (e) {
    console.error(error(`Can't read data from file... ${e.message}`));
    return [];
  }
};

const getMockData = async () => {
  const files = Object
    .values(MockFileName)
    .map((fileName) => getFileContent(`./data/${fileName}`));

  const [
    sentences,
    titles,
    categories,
    comments,
  ] = await Promise.all(files);

  return {
    sentences,
    titles,
    categories,
    comments,
  };
};

const generateCategories = (categories) => {
  return categories.map((title, index) => ({
    id: index + 1,
    title
  }));
};

const generateComment = (comments, articleId, users) => {
  const maxRowsCount = getRandomInt(1, comments.length);

  const text = shuffle(comments)
    .slice(0, maxRowsCount)
    .join(` `);

  return {
    text,
    userId: getRandomItem(users).id,
    articleId,
  };
};

const generateArticles = async (count, users) => {
  const {
    sentences,
    titles,
    categories,
    comments,
  } = await getMockData();

  return Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    publishedAt: generateDate(),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(2, sentences.length - 1)).join(` `),
    categories: getRandomItems(generateCategories(categories), 1, MAX_CATEGORY_LIMIT),
    comments: Array(getRandomInt(1, 5)).fill({}).map(() => generateComment(comments, index + 1, users)),
    userId: getRandomItem(users).id,
    image: `forest@1x.jpg`,
  }));
};

const generateRoles = () => {
  return USER_ROLES.map((title, index) => ({
    id: index + 1,
    title
  }));
};

const generateUsers = (count) => {
  return Array
    .from({length: count})
    .map((_, index) => createUser({
      id: index + 1,
      roleId: getRandomItem(generateRoles()).id,
    }));
};

const createFile = async (content) => {
  try {
    await fs.writeFile(MOCKS_DB_FILE_NAME, content);
    console.info(success(`Operation success. File created.`));
  } catch (e) {
    console.error(error(`Can't write data to file... ${e.message}`));
    process.exit(ExitCode.ERROR);
  }
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;

    if (count > MAX_COUNT_LIMIT) {
      console.info(warning(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const users = generateUsers(USER_COUNT);
    const categories = await getFileContent(`./data/${MockFileName.CATEGORIES}`);
    const articles = await generateArticles(countArticle, users);
    const comments = articles.flatMap((article) => article.comments);
    const roles = generateRoles();
    const articlesCategories = articles.flatMap((article, index) => {
      return article.categories.map((category) => ({
        articleId: index + 1,
        categoryId: category.id
      }));
    });

    const userValues = users.map(
        ({firstName, lastName, email, avatar, password, roleId}) =>
          `('${firstName}', '${lastName}', '${email}', '${avatar}', '${password}', '${roleId}')`
    ).join(`,\n`);

    const roleValues = roles
      .map(({title}) => `('${title}')`)
      .join(`,\n`);

    const categoryValues = categories
      .map((title) => `('${title}')`)
      .join(`,\n`);

    const articleValues = articles.map(
        ({title, image, announce, fullText, publishedAt, userId}) =>
          `('${title}', '${image}', '${announce}', '${fullText}', '${publishedAt}', '${userId}')`
    ).join(`,\n`);

    const articleCategoryValues = articlesCategories.map(
        ({articleId, categoryId}) =>
          `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, articleId}) =>
          `('${text}', ${userId}, ${articleId})`
    ).join(`,\n`);

    const content = `
      INSERT INTO roles(title) VALUES
        ${roleValues};
      INSERT INTO users(first_name, last_name, email, avatar, password, role_id) VALUES
        ${userValues};
      INSERT INTO categories(title) VALUES
        ${categoryValues};
      ALTER TABLE articles DISABLE TRIGGER ALL;
      INSERT INTO articles(title, image, announce, full_text, published_at, user_id) VALUES
        ${articleValues};
      ALTER TABLE articles ENABLE TRIGGER ALL;
      ALTER TABLE articles_categories DISABLE TRIGGER ALL;
      INSERT INTO articles_categories(article_id, category_id) VALUES
        ${articleCategoryValues};
      ALTER TABLE articles_categories ENABLE TRIGGER ALL;
      ALTER TABLE comments DISABLE TRIGGER ALL;
      INSERT INTO COMMENTS(text, user_id, article_id) VALUES
        ${commentValues};
      ALTER TABLE comments ENABLE TRIGGER ALL;
    `;

    await createFile(content);
  }
};
