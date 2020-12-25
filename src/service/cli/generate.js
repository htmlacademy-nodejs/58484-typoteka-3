'use strict';

const {nanoid} = require(`nanoid`);
const fs = require(`fs`).promises;
const moment = require(`moment`);
const {
  ExitCode,
  MOCKS_FILE_NAME,
  MAX_ID_LENGTH,
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
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT_LIMIT = 1000;

const MockFileName = {
  SENTENCES: `sentences.txt`,
  TITLES: `titles.txt`,
  CATEGORIES: `categories.txt`,
  COMMENTS: `comments.txt`,
};

const DateLimit = {
  DAYS: 90,
  HOURS: 24,
  MINUTES: 60,
  SECONDS: 60,
};

const generateDate = () => {
  const days = getRandomInt(1, DateLimit.DAYS);
  const hours = getRandomInt(1, DateLimit.HOURS);
  const minutes = getRandomInt(1, DateLimit.MINUTES);
  const seconds = getRandomInt(1, DateLimit.SECONDS);

  const date = moment();

  date.subtract(days, `day`);
  date.subtract(hours, `hour`);
  date.subtract(minutes, `minute`);
  date.subtract(seconds, `second`);

  return date.format(`YYYY-MM-DD HH:mm:ss`);
};

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

const generateComment = (comments) => {
  const maxRowsCount = getRandomInt(1, comments.length);

  const id = nanoid(MAX_ID_LENGTH);
  const text = shuffle(comments)
    .slice(0, maxRowsCount)
    .join(` `);

  return {
    id,
    text,
  };
};

const generateOffers = async (count) => {
  const {
    sentences,
    titles,
    categories,
    comments,
  } = await getMockData();

  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: generateDate(),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(2, sentences.length - 1)).join(` `),
    category: getRandomItems(categories),
    comments: Array(getRandomInt(1, 5)).fill({}).map(() => generateComment(comments)),
  }));
};

const createFile = async (content) => {
  try {
    await fs.writeFile(MOCKS_FILE_NAME, content);
    console.info(success(`Operation success. File created.`));
  } catch (e) {
    console.error(error(`Can't write data to file... ${e.message}`));
    process.exit(ExitCode.ERROR);
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;

    if (count > MAX_COUNT_LIMIT) {
      console.info(warning(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(await generateOffers(countOffer));

    await createFile(content);
  }
};
