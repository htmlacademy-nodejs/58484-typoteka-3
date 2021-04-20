'use strict';

const fs = require(`fs`).promises;
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const {createUser} = require(`./factories/user-factory`);
const {generateDate} = require(`./factories/date-factory`);

const {
  ExitCode,
  MockFileName,
} = require(`../../constants`);
const {ChalkTheme} = require(`./chalk-theme`);

const {
  success,
  error,
  warning,
} = ChalkTheme.filldb;

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
    categories: getRandomItems(generateCategories(categories), 1, MAX_CATEGORY_LIMIT).map(({id}) => id),
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

module.exports = {
  name: `--filldb`,
  async run(args) {
    // Connect to database
    try {
      console.info(success(`Trying to connect to database...`));
      await sequelize.authenticate();
    } catch (err) {
      return console.error(error(`An error occured: ${err.message}`));
    }
    console.info(success(`Connection to database established`));

    const [count] = args;

    if (count > MAX_COUNT_LIMIT) {
      console.info(warning(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const users = generateUsers(USER_COUNT);
    const categories = await getFileContent(`./data/${MockFileName.CATEGORIES}`);
    const articles = await generateArticles(countArticle, users);
    const roles = generateRoles();

    // fill DB
    console.info(success(`Trying to fill database...`));
    await initDatabase(sequelize, {
      users,
      categories,
      articles,
      roles
    });

    console.info(success(`Database filled!`));
    return process.exit(ExitCode.SUCCESS);
  }
};
